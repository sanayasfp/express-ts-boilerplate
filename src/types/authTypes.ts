import {z} from "zod";
import {
  emailCredentialsSchema,
  emailSchema,
  passwordSchema,
  phoneCredentialsSchema,
  phoneSchema,
  registerWithEmailSchema,
  registerWithPhoneSchema,
  routeSchema,
  strategySchema,
  verifyOtpFromEmailSchema,
  verifyOtpFromPhoneSchema,
  verifyOtpStrategySchema,
} from "@/validators/auth";

export type PasswordBody = z.infer<typeof passwordSchema>;

export type EmailBody = z.infer<typeof emailSchema>;

export type PhoneBody = z.infer<typeof phoneSchema>;

export type MobileOtpType = "sms" | "phone_change" | "invite" | "recovery";

export type EmailOtpType = "email" | "email_change" | "invite" | "recovery";

export type VerifyOtpFromPhoneBody = z.infer<typeof verifyOtpFromPhoneSchema> & { type: MobileOtpType };

export type VerifyOtpFromEmailBody = z.infer<typeof verifyOtpFromEmailSchema> & {
  type: EmailOtpType;
};

export type EmailCredentialsBody = z.infer<typeof emailCredentialsSchema>;

export type PhoneCredentialsBody = z.infer<typeof phoneCredentialsSchema>;

export type RegisterWithPhoneBody = z.infer<typeof registerWithPhoneSchema>;

export type RegisterWithEmailBody = z.infer<typeof registerWithEmailSchema>;

export type StrategyParams = z.infer<typeof strategySchema>;

export type RouteActionParams = z.infer<typeof routeSchema>;

export type VerifyOtpStrategyParams = z.infer<typeof verifyOtpStrategySchema> | StrategyParams;

export interface Token {
  access_token: string;
  token_type: string;
  user: SharedUser;
}

export interface ClientPayload {
  user: SharedUser;
  sub: string;
  iss: string;
  aud: string;
}

export interface User {
    token: Token;
    [key: string]: any;
}

export interface SharedUser {
  id: string;
  role: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string;
}
