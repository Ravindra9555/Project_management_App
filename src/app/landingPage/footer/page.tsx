import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <div>
         <footer className="border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                  ProjectFlow
                </span>
              </Link>
              <p className="mt-2 text-neutral-400">
                Powering projects for individuals and organizations
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">
                  Product
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#features"
                      className="text-neutral-400 hover:text-white"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pricing"
                      className="text-neutral-400 hover:text-white"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-neutral-400 hover:text-white"
                    >
                      Integrations
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">
                  Company
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-neutral-400 hover:text-white"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-neutral-400 hover:text-white"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-neutral-400 hover:text-white"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-neutral-400 hover:text-white"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-neutral-400 hover:text-white"
                    >
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-neutral-400 hover:text-white"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-400 text-sm">
            © {new Date().getFullYear()} ProjectFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
