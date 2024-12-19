package org.gucardev.awss3fileservice;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.http.SdkHttpMethod;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;


import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    @Value("${aws.bucket}")
    private String bucketName;

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    public String generatePreSignedUrl(String filePath, SdkHttpMethod method, AccessType accessType) {
        if (method == SdkHttpMethod.GET) {
            return generateGetPresidedUrl(filePath);
        } else if (method == SdkHttpMethod.PUT) {
            return generatePutPreSignedUrl(filePath, accessType);
        } else {
            throw new UnsupportedOperationException("Unsupported HTTP method: " + method);
        }
    }

    private String generateGetPresidedUrl(String filePath) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(filePath)
            .build();

        GetObjectPresignRequest preSignRequest = GetObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(60))
            .getObjectRequest(getObjectRequest)
            .build();

        PresignedGetObjectRequest preSignedRequest = s3Presigner.presignGetObject(preSignRequest);
        return preSignedRequest.url().toString();
    }

    private String generatePutPreSignedUrl(String filePath, AccessType accessType) {
        PutObjectRequest.Builder putObjectRequestBuilder = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(filePath);

        if (accessType == AccessType.PUBLIC) {
            putObjectRequestBuilder.acl(ObjectCannedACL.PUBLIC_READ);
        }

        PutObjectRequest putObjectRequest = putObjectRequestBuilder.build();

        PutObjectPresignRequest preSignRequest = PutObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(60))
            .putObjectRequest(putObjectRequest)
            .build();

        PresignedPutObjectRequest preSignedRequest = s3Presigner.presignPutObject(preSignRequest);
        return preSignedRequest.url().toString();
    }

    public List<MultiplePreSignedUrlResponse> generateMultiplePreSignedUrls(List<MultiplePreSignedUrlRequest> requests, AccessType accessType) {
        List<MultiplePreSignedUrlResponse> urls = new ArrayList<>();
        for (MultiplePreSignedUrlRequest request : requests) {
            String filename = buildFilename(request.getOriginalFileName());
            String url = generatePreSignedUrl(filename, SdkHttpMethod.PUT, accessType);
            MultiplePreSignedUrlResponse response = new MultiplePreSignedUrlResponse(url, filename, request.getOriginalFileName());
            urls.add(response);
        }
        return urls;
    }

    public String uploadMultipartFile(MultipartFile file, AccessType accessType) throws IOException {
        String fileName = buildFilename(file.getOriginalFilename());
        try (InputStream inputStream = file.getInputStream()) {
            PutObjectRequest.Builder putObjectRequestBuilder = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName);

            if (accessType == AccessType.PUBLIC) {
                putObjectRequestBuilder.acl(ObjectCannedACL.PUBLIC_READ);
            }

            PutObjectRequest putObjectRequest = putObjectRequestBuilder.build();
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
        }
        return fileName;
    }

    public S3ObjectInputStreamWrapper downloadFile(String fileName) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(fileName)
            .build();

        ResponseInputStream<GetObjectResponse> s3ObjectResponse = s3Client.getObject(getObjectRequest);
        String eTag = s3ObjectResponse.response().eTag();
        return new S3ObjectInputStreamWrapper(s3ObjectResponse, eTag);
    }

    /**
     * Improved streaming logic:
     * - Increased buffer size for potentially faster transfers.
     * - Removed unnecessary wrapping or exception rethrows.
     * - Consider returning a direct presigned URL to client to let them download directly from S3.
     */
    public ResponseEntity<InputStreamResource> downloadFileResponse(String fileName) throws IOException {
        // Determine content type based on fileName (local guess)
        String contentType = Files.probeContentType(Paths.get(fileName));
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        S3ObjectInputStreamWrapper fileWrapper = downloadFile(fileName);
        InputStream inputStream = fileWrapper.inputStream();

        // Wrap S3 input stream in InputStreamResource to directly stream to client
        InputStreamResource resource = new InputStreamResource(inputStream);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
        headers.add(HttpHeaders.CONTENT_TYPE, contentType);

        // Add ETag if available
        if (fileWrapper.eTag() != null) {
            headers.add(HttpHeaders.ETAG, fileWrapper.eTag());
        }

        // If we can determine content length from S3 response, set it (for efficiency)
        // This can improve client-side handling of downloads.
        if (inputStream instanceof ResponseInputStream<?> responseStream) {
          // Safely retrieve the GetObjectResponse without unchecked cast
            if (responseStream.response() instanceof GetObjectResponse getObjectResponse) {
              long contentLength = getObjectResponse.contentLength();
                if (contentLength > 0) {
                    headers.setContentLength(contentLength);
                }
            }
        }

        return ResponseEntity.ok()
            .headers(headers)
            .body(resource);
    }


    public static String buildFilename(String filename) {
        return String.format("%s_%s", System.currentTimeMillis(), sanitizeFileName(filename));
    }

    private static String sanitizeFileName(String fileName) {
        String normalizedFileName = Normalizer.normalize(fileName, Normalizer.Form.NFKD);
        return normalizedFileName.replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9.\\-_]", "");
    }

    /**
     * Alternatively, if performance is critical, just return a redirect or a pre-signed GET URL.
     * This way, client directly downloads the file from S3 without your server in the middle:
     *
     * public ResponseEntity<Void> redirectToS3(String fileName) {
     *     String presignedUrl = generatePreSignedUrl(fileName, SdkHttpMethod.GET, AccessType.PUBLIC);
     *     return ResponseEntity.status(HttpStatus.FOUND)
     *          .location(URI.create(presignedUrl))
     *          .build();
     * }
     */
}
