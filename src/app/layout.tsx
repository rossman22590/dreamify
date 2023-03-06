import './globals.css'

/**
 * @link https://beta.nextjs.org/docs/api-reference/file-conventions/head
 */
export const metadata = {
  title: 'Dreamify',
  description: 'A simple generator of images from AI. Using Stable Diffusion.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
