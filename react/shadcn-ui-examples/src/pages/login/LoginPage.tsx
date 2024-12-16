import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslate } from "@/hooks";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { ToastAction } from "@/components/ui/toast";

// Improved schema with additional validation rules
const formSchema = z.object({
  email: z.string().email({ message: "email_invalid" }), // Replace with translation keys
  password: z
    .string()
    .min(6, { message: "password_min" }) // Replace with translation keys
    .regex(/[a-zA-Z0-9]/, { message: "password_alphanumeric" }),
});

export default function LoginPage() {
  const { t } = useTranslate();
  // const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Assuming an async login function
      console.log(values);
      toast.success(JSON.stringify(values, null, 2), {
        action: {
          label: 'Action',
          onClick: () => console.log('Action!'),
        },
      });

      toast.error(t("form_submission_error"), {
        action: {
          label: 'Action',
          onClick: () => console.log('Action!'),
        },
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(t("form_submission_error"), {
        action: {
          label: 'Action',
          onClick: () => console.log('Action!'),
        },
      });
    }
  }

  return (
    <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("login")}</CardTitle>
          <CardDescription>{t("login_placeholder")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">{t("username")}</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder={t("username_placeholder")}
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {t(form.formState.errors.email?.message || "")}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">
                          {t("password")}
                        </FormLabel>
                        <a
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                        >
                          {t("forgot_password")}
                        </a>
                      </div>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder={t("password_placeholder")}
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {t(form.formState.errors.password?.message || "")}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {t("login")}
                </Button>
                <Button variant="outline" className="w-full">
                  {t("login_with_google")}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {t("no_account")}{" "}
            <a href="#" className="underline">
              {t("sign_up")}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
