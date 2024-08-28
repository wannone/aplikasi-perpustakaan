export const Navbar = () => {
    return (
      <header className="sticky top-0 z-10 w-full bg-background/95 shadow-lg backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <div className="mx-4 sm:mx-8 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground">Admin</h1>
              <p className="text-sm text-gray-500">admin@admin.com</p>
            </div>
          </div>
          <button className="text-sm text-primary hover:text-primary-dark transition duration-300">
            Sign out
          </button>
        </div>
      </header>
    );
  }
  