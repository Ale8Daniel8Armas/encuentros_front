export default function Footer() {
  return (
    <footer className="mt-10 bg-red-700 text-amber-100 border-t-4 border-amber-400">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-semibold tracking-wide">
            © {new Date().getFullYear()} Encuentros
          </div>
        </div>
      </div>
    </footer>
  )
}
