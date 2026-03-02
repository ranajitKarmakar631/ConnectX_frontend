import AuthInitializer from "./AuthInitializer";
import Providers from "./providers";
import SocketInitializer from "./SocketInitializer";
import "./globals.css";
import SocketProvider from "./SocketProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SocketProvider>
            <SocketInitializer>
              <AuthInitializer>{children}</AuthInitializer>
            </SocketInitializer>
          </SocketProvider>
        </Providers>
      </body>
    </html>
  );
}
