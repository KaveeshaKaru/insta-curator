import LandingLayoutWrapper from "@/components/LandingLayoutWrapper"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LandingLayoutWrapper>
      {children}
    </LandingLayoutWrapper>
  );
} 