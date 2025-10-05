import "./globals.css";
export const metadata = { title: "Anti-Theft System" };

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
