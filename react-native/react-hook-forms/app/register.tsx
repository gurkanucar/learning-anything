import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "./utils/validation";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';

const INTERESTS = [
  "Technology",
  "Sports",
  "Music",
  "Reading",
  "Travel",
  "Food",
  "Art",
];

const SKILLS = [
  "React",
  "React Native",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Java",
  "Swift",
  "Kotlin",
];

export default function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      gender: "other",
      address: "",
      bio: "",
      interests: [],
      acceptTerms: false,
      notifications: true,
      userType: "personal",
      birthDate: new Date(),
      availableDates: {
        from: new Date(),
        to: new Date(),
      },
      time: "12:00",
      experience: 0,
      seniority: "junior",
      skills: [],
      age: null as unknown as number,
    },
  });

  const [showPickers, setShowPickers] = useState({
    birthDate: false,
    dateFrom: false,
    dateTo: false,
    time: false,
  });

  const onSubmit = async (data: RegisterFormData) => {
    Alert.alert(
      "Registration Data",
      JSON.stringify(data, null, 2)
        .replace(/[{}"]/g, '')
        .replace(/,/g, '\n')
        .replace(/:/g, ': '),
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* Basic Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Full Name"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                editable={!isSubmitting}
              />
            )}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="age"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                placeholder="Age"
                value={value === null ? '' : value.toString()}
                onChangeText={(text) => {
                  if (text === '') {
                    onChange(null);
                  } else {
                    const number = parseInt(text);
                    if (!isNaN(number)) {
                      onChange(number);
                    }
                  }
                }}
                keyboardType="numeric"
                maxLength={3}
                editable={!isSubmitting}
              />
            )}
          />
          {errors.age && (
            <Text style={styles.errorText}>{errors.age.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>

        {/* Gender Picker */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                enabled={!isSubmitting}
                style={[styles.picker, errors.gender && styles.inputError]}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            )}
          />
          {errors.gender && (
            <Text style={styles.errorText}>{errors.gender.message}</Text>
          )}
        </View>

        {/* Date Inputs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dates</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birth Date</Text>
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    style={[styles.input, errors.birthDate && styles.inputError]}
                    onPress={() => setShowPickers(prev => ({ ...prev, birthDate: true }))}
                  >
                    <Text>{value.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {(showPickers.birthDate && Platform.OS === 'android') && (
                    <DateTimePicker
                      value={value}
                      mode="date"
                      display="default"
                      onChange={(_, selectedDate) => {
                        setShowPickers(prev => ({ ...prev, birthDate: false }));
                        selectedDate && onChange(selectedDate);
                      }}
                      disabled={isSubmitting}
                    />
                  )}
                  {(showPickers.birthDate && Platform.OS === 'ios') && (
                    <View style={styles.iosPickerContainer}>
                      <View style={styles.iosPickerHeader}>
                        <TouchableOpacity
                          onPress={() => setShowPickers(prev => ({ ...prev, birthDate: false }))}
                        >
                          <Text style={styles.iosPickerDone}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={value}
                        mode="date"
                        display="spinner"
                        onChange={(_, selectedDate) => {
                          selectedDate && onChange(selectedDate);
                        }}
                        disabled={isSubmitting}
                      />
                    </View>
                  )}
                </>
              )}
            />
            {errors.birthDate && (
              <Text style={styles.errorText}>{errors.birthDate.message}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Available Period</Text>
            <View style={styles.dateRangeContainer}>
              <View style={styles.dateRangeInput}>
                <Text style={styles.dateRangeLabel}>From</Text>
                <Controller
                  control={control}
                  name="availableDates.from"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TouchableOpacity
                        style={[styles.input, errors.availableDates?.from && styles.inputError]}
                        onPress={() => setShowPickers(prev => ({ ...prev, dateFrom: true }))}
                      >
                        <Text>{value.toLocaleDateString()}</Text>
                      </TouchableOpacity>
                      {(showPickers.dateFrom && Platform.OS === 'android') && (
                        <DateTimePicker
                          value={value}
                          mode="date"
                          display="default"
                          onChange={(_, selectedDate) => {
                            setShowPickers(prev => ({ ...prev, dateFrom: false }));
                            selectedDate && onChange(selectedDate);
                          }}
                          disabled={isSubmitting}
                        />
                      )}
                      {(showPickers.dateFrom && Platform.OS === 'ios') && (
                        <View style={styles.iosPickerContainer}>
                          <View style={styles.iosPickerHeader}>
                            <TouchableOpacity
                              onPress={() => setShowPickers(prev => ({ ...prev, dateFrom: false }))}
                            >
                              <Text style={styles.iosPickerDone}>Done</Text>
                            </TouchableOpacity>
                          </View>
                          <DateTimePicker
                            value={value}
                            mode="date"
                            display="spinner"
                            onChange={(_, selectedDate) => {
                              selectedDate && onChange(selectedDate);
                            }}
                            disabled={isSubmitting}
                          />
                        </View>
                      )}
                    </>
                  )}
                />
              </View>
              <View style={styles.dateRangeInput}>
                <Text style={styles.dateRangeLabel}>To</Text>
                <Controller
                  control={control}
                  name="availableDates.to"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TouchableOpacity
                        style={[styles.input, errors.availableDates?.to && styles.inputError]}
                        onPress={() => setShowPickers(prev => ({ ...prev, dateTo: true }))}
                      >
                        <Text>{value.toLocaleDateString()}</Text>
                      </TouchableOpacity>
                      {(showPickers.dateTo && Platform.OS === 'android') && (
                        <DateTimePicker
                          value={value}
                          mode="date"
                          display="default"
                          onChange={(_, selectedDate) => {
                            setShowPickers(prev => ({ ...prev, dateTo: false }));
                            selectedDate && onChange(selectedDate);
                          }}
                          disabled={isSubmitting}
                          minimumDate={watch('availableDates.from')}
                        />
                      )}
                      {(showPickers.dateTo && Platform.OS === 'ios') && (
                        <View style={styles.iosPickerContainer}>
                          <View style={styles.iosPickerHeader}>
                            <TouchableOpacity
                              onPress={() => setShowPickers(prev => ({ ...prev, dateTo: false }))}
                            >
                              <Text style={styles.iosPickerDone}>Done</Text>
                            </TouchableOpacity>
                          </View>
                          <DateTimePicker
                            value={value}
                            mode="date"
                            display="spinner"
                            onChange={(_, selectedDate) => {
                              selectedDate && onChange(selectedDate);
                            }}
                            disabled={isSubmitting}
                            minimumDate={watch('availableDates.from')}
                          />
                        </View>
                      )}
                    </>
                  )}
                />
              </View>
            </View>
            {errors.availableDates?.from && (
              <Text style={styles.errorText}>{errors.availableDates.from.message}</Text>
            )}
            {errors.availableDates?.to && (
              <Text style={styles.errorText}>{errors.availableDates.to.message}</Text>
            )}
          </View>
        </View>

        {/* Time Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preferred Time</Text>
          <Controller
            control={control}
            name="time"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  style={[styles.input, errors.time && styles.inputError]}
                  onPress={() => setShowPickers(prev => ({ ...prev, time: true }))}
                >
                  <Text>{value}</Text>
                </TouchableOpacity>
                {(showPickers.time && Platform.OS === 'android') && (
                  <DateTimePicker
                    value={new Date(`2000-01-01T${value}`)}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(_, selectedDate) => {
                      setShowPickers(prev => ({ ...prev, time: false }));
                      if (selectedDate) {
                        onChange(selectedDate.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        }));
                      }
                    }}
                  />
                )}
                {(showPickers.time && Platform.OS === 'ios') && (
                  <View style={styles.iosPickerContainer}>
                    <View style={styles.iosPickerHeader}>
                      <TouchableOpacity
                        onPress={() => setShowPickers(prev => ({ ...prev, time: false }))}
                      >
                        <Text style={styles.iosPickerDone}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={new Date(`2000-01-01T${value}`)}
                      mode="time"
                      is24Hour={true}
                      display="spinner"
                      onChange={(_, selectedDate) => {
                        if (selectedDate) {
                          onChange(selectedDate.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                          }));
                        }
                      }}
                    />
                  </View>
                )}
              </>
            )}
          />
          {errors.time && (
            <Text style={styles.errorText}>{errors.time.message}</Text>
          )}
        </View>

        {/* Experience Slider */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Experience (years): {watch('experience')}</Text>
          <Controller
            control={control}
            name="experience"
            render={({ field: { onChange, value } }) => (
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={20}
                step={1}
                value={value}
                onSlidingComplete={onChange}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#ddd"
              />
            )}
          />
          {errors.experience && (
            <Text style={styles.errorText}>{errors.experience.message}</Text>
          )}
        </View>

        {/* Seniority Level */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Seniority Level</Text>
          <Controller
            control={control}
            name="seniority"
            render={({ field: { onChange, value } }) => (
              <View style={styles.radioListGroup}>
                {['junior', 'mid', 'senior'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={styles.radioListItem}
                    onPress={() => onChange(level)}
                    disabled={isSubmitting}
                  >
                    <View style={styles.radioCircle}>
                      {value === level && <View style={styles.radioCircleFilled} />}
                    </View>
                    <Text style={styles.radioListText}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.seniority && (
            <Text style={styles.errorText}>{errors.seniority.message}</Text>
          )}
        </View>
      </View>

      {/* Account Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Type</Text>
        <Controller
          control={control}
          name="userType"
          render={({ field: { onChange, value } }) => (
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  value === "personal" && styles.radioButtonSelected,
                ]}
                onPress={() => onChange("personal")}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.radioText,
                    value === "personal" && styles.radioTextSelected,
                  ]}
                >
                  Personal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  value === "business" && styles.radioButtonSelected,
                ]}
                onPress={() => onChange("business")}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.radioText,
                    value === "business" && styles.radioTextSelected,
                  ]}
                >
                  Business
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.userType && (
          <Text style={styles.errorText}>{errors.userType.message}</Text>
        )}
      </View>

      {/* Interests Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <Controller
          control={control}
          name="interests"
          render={({ field: { onChange, value } }) => (
            <View style={styles.checkboxGroup}>
              {INTERESTS.map((interest) => (
                <View key={interest} style={styles.checkboxItem}>
                  <Checkbox
                    value={value.includes(interest)}
                    onValueChange={(checked) => {
                      const newInterests = checked
                        ? [...value, interest]
                        : value.filter((i) => i !== interest);
                      onChange(newInterests);
                    }}
                    disabled={isSubmitting}
                    color={value.includes(interest) ? "#007AFF" : undefined}
                  />
                  <Text style={styles.checkboxLabel}>{interest}</Text>
                </View>
              ))}
            </View>
          )}
        />
        {errors.interests && (
          <Text style={styles.errorText}>{errors.interests.message}</Text>
        )}
      </View>

      {/* Skills Chips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Controller
          control={control}
          name="skills"
          render={({ field: { onChange, value } }) => (
            <>
              <View style={styles.chipsContainer}>
                {SKILLS.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={[
                      styles.chip,
                      value.includes(skill) && styles.chipSelected,
                    ]}
                    onPress={() => {
                      const newValue = value.includes(skill)
                        ? value.filter((s) => s !== skill)
                        : [...value, skill];
                      onChange(newValue);
                    }}
                    disabled={isSubmitting}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        value.includes(skill) && styles.chipTextSelected,
                      ]}
                    >
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.skills && (
                <Text style={styles.errorText}>{errors.skills.message}</Text>
              )}
            </>
          )}
        />
      </View>

      {/* Address and Bio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.textArea, errors.address && styles.inputError]}
                placeholder="Address"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                editable={!isSubmitting}
              />
            )}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.textArea, errors.bio && styles.inputError]}
                placeholder="Bio (optional)"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
                editable={!isSubmitting}
              />
            )}
          />
          {errors.bio && (
            <Text style={styles.errorText}>{errors.bio.message}</Text>
          )}
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.switchContainer}>
          <Controller
            control={control}
            name="notifications"
            render={({ field: { onChange, value } }) => (
              <>
                <Text style={styles.switchLabel}>Enable Notifications</Text>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  disabled={isSubmitting}
                />
              </>
            )}
          />
        </View>
      </View>

      {/* Terms and Password */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Security</Text>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                editable={!isSubmitting}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                placeholder="Confirm Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                editable={!isSubmitting}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>

        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="acceptTerms"
            render={({ field: { onChange, value } }) => (
              <>
                <Checkbox
                  value={value}
                  onValueChange={onChange}
                  disabled={isSubmitting}
                  color={value ? "#007AFF" : undefined}
                />
                <Text style={styles.termsText}>
                  I accept the terms and conditions
                </Text>
              </>
            )}
          />
          {errors.acceptTerms && (
            <Text style={styles.errorText}>{errors.acceptTerms.message}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/login")}
        disabled={isSubmitting}
        style={styles.loginLink}
      >
        <Text style={[styles.link, isSubmitting && styles.linkDisabled]}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    height: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  slider: {
    height: 40,
    width: '100%',
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  radioButtonSelected: {
    backgroundColor: "#007AFF",
  },
  radioText: {
    color: "#007AFF",
  },
  radioTextSelected: {
    color: "#fff",
  },
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  termsText: {
    marginLeft: 8,
    flex: 1,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  switchLabel: {
    color: "#666",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#DDDDDD",
  },
  loginLink: {
    marginBottom: 30,
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
  },
  linkDisabled: {
    color: "#DDDDDD",
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateRangeInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateRangeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  iosPickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  iosPickerDone: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioListGroup: {
    marginTop: 5,
  },
  radioListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleFilled: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  radioListText: {
    fontSize: 16,
    color: '#333',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    color: '#007AFF',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
});
