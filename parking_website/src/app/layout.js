import "./globals.css";

export const metadata = {
  title: "Parking Dashboard",
  description: "Smart parking management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
