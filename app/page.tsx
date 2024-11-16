import { Button } from "@/components/ui/button";
import {
  LucideGraduationCap,
  LucideBookOpen,
  ShieldCheck,
  LucideSmile,
  LucideBarChart2,
  LucideHelpCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Planoeducation</h1>
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <Button variant="outline">Sign In</Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            Empowering Education with <span className="text-blue-500">Planoeducation</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Your one-stop platform for academic resources, tools, and certifications.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button>Get Started</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Our Features</h2>
          <p className="mt-4 text-gray-400">
            Explore the tools and services we provide to enhance your learning experience.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-700 p-6">
              <LucideGraduationCap size={48} className="text-blue-500" />
              <h3 className="text-xl font-semibold text-white">Comprehensive Courses</h3>
              <p className="text-gray-400">
                Access a variety of courses designed by experts across multiple domains.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-700 p-6">
              <LucideBookOpen size={48} className="text-green-500" />
              <h3 className="text-xl font-semibold text-white">Study Materials</h3>
              <p className="text-gray-400">
                Download high-quality materials to boost your academic performance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-700 p-6">
              <ShieldCheck size={48} className="text-yellow-500" />
              <h3 className="text-xl font-semibold text-white">Certifications</h3>
              <p className="text-gray-400">
                Earn recognized certificates to enhance your professional journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Our Achievements</h2>
          <p className="mt-4 text-gray-400">Trusted by learners worldwide.</p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center">
              <LucideSmile size={48} className="text-blue-500" />
              <h3 className="mt-4 text-2xl font-bold text-white">50K+</h3>
              <p className="text-gray-400">Happy Students</p>
            </div>
            <div className="flex flex-col items-center">
              <LucideBarChart2 size={48} className="text-green-500" />
              <h3 className="mt-4 text-2xl font-bold text-white">120+</h3>
              <p className="text-gray-400">Courses Available</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck size={48} className="text-yellow-500" />
              <h3 className="mt-4 text-2xl font-bold text-white">98%</h3>
              <p className="text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white">What Our Students Say</h2>
          <div className="mt-12 flex flex-col gap-8 md:flex-row">
            {/* Testimonial 1 */}
            <div className="flex flex-col gap-4 rounded-lg bg-gray-700 p-6">
              <p className="text-gray-300">
                "Planoeducation has completely transformed my learning experience. The courses are
                well-structured and the study materials are top-notch!"
              </p>
              <p className="text-sm font-medium text-gray-400">- Alex D.</p>
            </div>
            {/* Testimonial 2 */}
            <div className="flex flex-col gap-4 rounded-lg bg-gray-700 p-6">
              <p className="text-gray-300">
                "The certifications helped me land my dream job. Highly recommend this platform to
                anyone looking to upskill!"
              </p>
              <p className="text-sm font-medium text-gray-400">- Priya K.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
          <div className="mt-12 flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <LucideHelpCircle size={32} className="text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-white">What is Planoeducation?</h3>
                <p className="text-gray-400">
                  Planoeducation is a platform offering courses, study materials, and certifications
                  to help you achieve academic and professional success.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <LucideHelpCircle size={32} className="text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-white">Are the certifications recognized?</h3>
                <p className="text-gray-400">
                  Yes, all certifications provided by Planoeducation are recognized by leading
                  organizations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">© 2024 Planoeducation. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
