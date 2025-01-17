"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Button,
  Drawer,
  FieldWrapper,
  FloatButton,
  Input,
  Modal,
} from "@/components/common";
import { useIsMobile, useToast } from "@/hooks";
import SendEmail from "@/lib/api/reset-password/send-email";
import { emailSchema } from "@/lib/schemas/auth";
import { LoadingSpinner } from "@/public/assets/icons";
import { EmailInput } from "@/types/auth";

interface ResetPasswordComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetPasswordComponent = ({
  isOpen,
  onClose,
}: ResetPasswordComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();
  const isMobile = useIsMobile();

  const CommonResetPassword = isMobile ? Drawer : Modal;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<EmailInput> = async ({ email }) => {
    setIsLoading(true);

    const redirectUrl = "https://3team-coworkers.netlify.app";

    const { success: apiSuccess, data } = await SendEmail(email, redirectUrl);

    if (apiSuccess) {
      success(data.message);
    } else {
      error(data.message);
    }

    setIsLoading(false);
  };

  return (
    isOpen && (
      <CommonResetPassword
        onClose={onClose}
        title="비밀번호 재설정"
        description="비밀번호 재설정 링크를 보내드립니다."
        showCloseButton
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldWrapper
            id="email"
            label=""
            errorMessage={errors.email?.message || ""}
          >
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요."
              {...register("email")}
              isError={!!errors.email}
            />
          </FieldWrapper>
          <div className="flex gap-8">
            <Button
              onClick={onClose}
              variant="secondary"
              className="mt-15 h-48 w-136"
            >
              닫기
            </Button>
            {isLoading ? (
              <FloatButton
                Icon={<LoadingSpinner width={30} height={30} />}
                disabled
                variant="primary"
                className="mt-15 h-48 w-136"
              >
                처리 중...
              </FloatButton>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={!isValid}
                className="mt-15 h-48 w-136"
              >
                링크 보내기
              </Button>
            )}
          </div>
        </form>
      </CommonResetPassword>
    )
  );
};

export default ResetPasswordComponent;
