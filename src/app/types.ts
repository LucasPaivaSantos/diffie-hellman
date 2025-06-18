import { CSSProperties, ReactNode } from "react";

export interface User {
  name: string;
  privateKey: number | null;
  publicKey: number | null;
  receivedPublicKey: number | null;
  sharedSecret: number | null;
  color: string;
}

export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "amber";
  style?: CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
}

export interface UserCardProps {
  user: User;
  isLeft: boolean;
  showPrivateKeys: boolean;
  onTogglePrivateKeys: () => void;
  g: number;
  p: number;
}
