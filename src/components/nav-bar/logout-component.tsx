"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Drawer, Modal } from "@/components/common";
import { useIsMobile, useToast } from "@/hooks";
import { deleteCookie } from "@/utils/next-cookie";

interface LogoutComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutComponent = ({ isOpen, onClose }: LogoutComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();
  const router = useRouter();
  const isMobile = useIsMobile();

  const CommonLogout = isMobile ? Drawer : Modal;

  const queryClient = useQueryClient();

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      await deleteCookie("token");
      await deleteCookie("refreshToken");
      await deleteCookie("userId");
      success("로그아웃 성공");

      queryClient.invalidateQueries({ queryKey: ["userData"] });

      router.push("/");
    } catch (err) {
      error("로그아웃 실패");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    isOpen && (
      <CommonLogout
        onClose={onClose}
        title="로그아웃 하시겠어요?"
        className="h-171 w-384"
      >
        <div className="flex gap-8">
          <Button variant="secondary" onClick={onClose} className="h-48 w-136">
            닫기
          </Button>
          <Button
            type="submit"
            variant="danger"
            disabled={isLoading}
            className="h-48 w-136"
            onClick={onSubmit}
          >
            {isLoading ? "처리 중..." : "로그아웃"}
          </Button>
        </div>
      </CommonLogout>
    )
  );
};

export default LogoutComponent;