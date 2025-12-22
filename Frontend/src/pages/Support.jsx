import React, { useState } from "react";
import { Mail, HelpCircle, MessageSquare, ChevronDown, ChevronUp, Send, Smartphone, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const faqs = [
  {
    question: "What is the Bed Notification System (BNS)?",
    answer: "BNS is a specialized hospital management platform that simplifies bed, ward, and department assignments. It helps supervisors and healthcare workers manage rotations, track expiries, and stay updated through real-time notifications.",
  },
  {
    question: "Who can use BNS?",
    answer: "BNS is strictly designed for healthcare institutions. Verified admins, supervisors, and medical staff members use it to synchronize patient bed allocations and duty schedules.",
  },
  {
    question: "What happens when my ward or department expires?",
    answer: "Once your assignment reaches its expiry date, the system will restrict access to current ward data and prompt you to update your assignment to ensure all hospital records remain accurate.",
  },
  {
    question: "I can’t log in or verify my email. What should I do?",
    answer: "First, verify your spam/junk folder. If the OTP hasn't arrived within 2 minutes, ensure your email was typed correctly. For persistent issues, contact your hospital's system supervisor.",
  },
  {
    question: "How do I contact technical support?",
    answer: "You can use the secure form below for email support or join our dedicated Telegram dev-channel for immediate assistance with technical bugs or activation issues.",
  },
];

const Support = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);

    const mailtoLink = `mailto:yamlaknegash96@gmail.com?subject=BNS Support Request: ${encodeURIComponent(form.name)}&body=${encodeURIComponent(`Message: ${form.message}\n\nFrom: ${form.email}`)}`;

    window.location.href = mailtoLink;

    setLoading(false);
    toast.success("Redirecting to your email client... 💬");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    /* pt-20 added to clear the sticky Navbar */
    <div className="min-h-screen bg-white pt-20 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex p-4 bg-indigo-50 rounded-[2rem] mb-6 shadow-sm border border-indigo-100">
            <Smartphone className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 mb-4 tracking-tighter italic">
            Support <span className="text-indigo-600">Center</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Get technical assistance and find answers to keep your <span className="text-slate-900 font-bold">BNS workflow</span> running smoothly.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* FAQ Column */}
          <section className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Common Questions</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`group rounded-[2rem] transition-all duration-300 border-2 ${
                    openIndex === index 
                      ? 'bg-slate-900 border-indigo-500 shadow-xl' 
                      : 'bg-white border-slate-100 hover:border-indigo-100'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="cp w-full flex justify-between items-center px-8 py-6 text-left"
                  >
                    <span className={`text-lg font-bold tracking-tight ${openIndex === index ? 'text-white' : 'text-slate-800'}`}>
                      {faq.question}
                    </span>
                    <div className={`p-2 rounded-full transition-all ${openIndex === index ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>
                  {openIndex === index && (
                    <div className="px-8 pb-6 animate-in slide-in-from-top-2 duration-300">
                      <div className="h-px bg-white/10 mb-6" />
                      <p className="text-slate-300 font-medium leading-relaxed italic">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Column */}
          <section className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Direct Contact</h2>
            </div>

            {/* Support Form */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:border-indigo-500 transition-all outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">your Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:border-indigo-500 transition-all outline-none"
                    placeholder="example@gmail.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message Detail</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:border-indigo-500 transition-all outline-none"
                    rows="4"
                    placeholder="Describe your issue..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cp w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? "Initializing..." : <><Mail size={18} /> Send Ticket</>}
                </button>
              </form>
            </div>

            {/* Quick Link Card */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between group overflow-hidden relative shadow-lg shadow-indigo-200">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
                  <MessageCircle size={80} />
               </div>
               <div className="relative z-10">
                 <h3 className="font-black text-xl mb-1">Instant Chat</h3>
                 <p className="text-indigo-100 text-sm font-bold">Get 24/7 dev support on Telegram</p>
               </div>
               <a 
                href="https://t.me/NYDev_Chat" 
                target="_blank" 
                rel="noreferrer" 
                className="cp relative z-10 p-4 bg-white text-indigo-600 rounded-2xl hover:scale-110 transition-transform shadow-lg"
               >
                 <MessageCircle size={24} />
               </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Support;