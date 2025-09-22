
import Providers from './providers'

export const metadata = {
  title: 'Memory Game',
  description: 'A memory/concentration game',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
