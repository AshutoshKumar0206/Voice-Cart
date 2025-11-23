import VerifyEmailClient from "./VerifyEmailClient";

export default function EmailVerificationPage({ searchParams }: any) {
  const email = searchParams?.email || "";
  return <VerifyEmailClient email={email} />;
}
