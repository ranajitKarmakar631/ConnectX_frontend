"use client";
import { useLoginUserMutation } from "@/service/authService/authService";
import { Button, Input } from "antd";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import { useAppDispatch } from "@/Redux/hooks";

import z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginSuccess } from "@/Redux/authSlice";
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const LoginForm = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const loginMutation = useLoginUserMutation();
  const handleSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const result = await loginMutation.mutateAsync(values);

      if (result?.data?._id && result.data.email) {
        localStorage.setItem("user", JSON.stringify(result.data));

        dispatch(
          loginSuccess({
            user: result?.data,
          }),
        );
        console.log("loging success", result?.data?._id);
        if (result?.data?._id) {
          router.replace(`/chat/${result?.data?._id}`);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={toFormikValidationSchema(schema)}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                name="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
              />
              {touched.email && errors.email && (
                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            <div>
              <Input
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
              />
              {touched.password && errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.password}
                </div>
              )}
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loginMutation.isPending}
            >
              Sign In
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
