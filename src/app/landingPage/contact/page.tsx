// "use client";
// import { motion } from "framer-motion";
// import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";
// import { Button } from "@/app/components/ui/button";
// import { Input } from "@/app/components/ui/input";
// import { Label } from "@/app/components/ui/label";
// import { Textarea } from "@/app/components/ui/textarea";
// import { toast } from "react-hot-toast";
// import { useState } from "react";
// import { LampContainer } from "@/app/components/ui/lamp"; // Example animation
// import Navbar from "../Navbar/page";

// export default function ContactForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!formData.name || !formData.email || !formData.message) {
//       toast.error("Please fill all fields");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       toast.success("Message sent successfully!");
//       setFormData({ name: "", email: "", message: "" });
//     } catch (error) {
//       toast.error("Failed to send message. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="">
     
//       <div className="w-full px-4 pb-10 md:px-10 lg:px-20">
//          <Navbar />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-neutral-900 rounded-xl border border-neutral-800 shadow-2xl overflow-hidden">
//           {/* Left Column: Image or Animation */}
//           <div className="hidden md:block h-full bg-black relative">
//             <LampContainer>
//               <div className="p-6 text-left">
//                 <h3 className="text-2xl font-semibold text-emerald-400 mb-2">
//                   Need Help?
//                 </h3>
//                 <p className="text-neutral-400">
//                   Reach out to us for enterprise solutions, product inquiries,
//                   or support. We’re here to help!
//                 </p>
//               </div>
//             </LampContainer>
//           </div>

//           {/* Right Column: Form */}
//           <div className="p-6 md:p-10">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="text-center mb-8"
//             >
//               <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 mb-2">
//                 Get In Touch
//               </h2>
//               <TextGenerateEffect
//                 words="Have questions about our plans? Want to discuss enterprise options? Send us a message."
//                 className="text-neutral-400"
//               />
//             </motion.div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name" className="text-neutral-300">
//                     Full Name
//                   </Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     placeholder="John Doe"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-neutral-300">
//                     Email Address
//                   </Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="your@email.com"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="message" className="text-neutral-300">
//                   Your Message
//                 </Label>
//                 <Textarea
//                   id="message"
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   required
//                   rows={5}
//                   placeholder="Tell us about your project or inquiry..."
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold py-3"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Sending...
//                   </span>
//                 ) : (
//                   "Send Message"
//                 )}
//               </Button>
//             </form>

//             <div className="text-center text-sm text-neutral-500 mt-8">
//               <p>
//                 Or email us directly at{" "}
//                 <a
//                   href="mailto:contact@projectflow.com"
//                   className="text-emerald-500 hover:text-emerald-400"
//                 >
//                   contact@projectflow.com
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { LampContainer } from "@/app/components/ui/lamp";
import Navbar from "../Navbar/page";
import Footer from "../footer/page";
// import Footer from "../Footer/page"; // <-- Add your footer component

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-16 px-4 px:5 md:px-10 lg:px-20 mt-2 mb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-neutral-900 rounded-xl border border-neutral-800 shadow-2xl overflow-hidden">
          {/* Left Column: Image/Animation/Info */}
          <div className="hidden md:block h-full bg-black relative">
            <LampContainer>
              <div className="px-6 py-2 text-left">
                <h3 className="text-2xl font-semibold text-emerald-400 mb-2">
                  Need Help?
                </h3>
                <p className="text-neutral-400">
                  Reach out to us for enterprise solutions, product inquiries,
                  or support. We’re here to help!
                </p>
              </div>
            </LampContainer>
          </div>

          {/* Right Column: Form */}
          <div className="px-6 py-2 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 mb-2">
                Get In Touch
              </h2>
              <TextGenerateEffect
                words="Have questions about our plans? Want to discuss enterprise options? Send us a message."
                className="text-neutral-400"
              />
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-neutral-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-neutral-300">
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us about your project or inquiry..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-neutral-500 mt-8">
              <p>
                Or email us directly at{" "}
                <a
                  href="mailto:contact@projectflow.com"
                  className="text-emerald-500 hover:text-emerald-400"
                >
                  contact@projectflow.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
     <Footer/>
    </div>
  );
}
