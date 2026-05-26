import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";

export default function App() {
  const [registered, setRegistered] = useState(false);

  const [form, setForm] = useState({
    name: "",
    gmail: "",
    emergency1: "",
    emergency2: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("safeUser");

    if (saved) {
      setForm(JSON.parse(saved));
      setRegistered(true);
    }
  }, []);

  const saveUser = () => {
    localStorage.setItem("safeUser", JSON.stringify(form));
    setRegistered(true);
  };

  const sendSOS = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const locationLink = `https://maps.google.com/?q=${lat},${lng}`;

      const params = {
        user_name: form.name,
        message: `HELP! ${form.name} needs help.\n\nLocation: ${locationLink}`,
      };

      emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        params,
        "YOUR_PUBLIC_KEY"
      );

      alert("Emergency Alert Sent");
    });
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      if (
        transcript.includes("help") ||
        transcript.includes("save me")
      ) {
        sendSOS();
      }
    };

    recognition.start();
  }, [form]);

  if (!registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-pink-700 text-white p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <h1 className="text-5xl font-bold text-center mb-4">
            SafeShield
          </h1>

          <p className="text-center mb-8 text-gray-200">
            Your Voice. Your Safety.
          </p>

          <div className="space-y-4">
            <input
              placeholder="Full Name"
              className="w-full p-4 rounded-xl text-black"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Your Gmail"
              className="w-full p-4 rounded-xl text-black"
              onChange={(e) =>
                setForm({ ...form, gmail: e.target.value })
              }
            />

            <input
              placeholder="Emergency Gmail 1"
              className="w-full p-4 rounded-xl text-black"
              onChange={(e) =>
                setForm({ ...form, emergency1: e.target.value })
              }
            />

            <input
              placeholder="Emergency Gmail 2"
              className="w-full p-4 rounded-xl text-black"
              onChange={(e) =>
                setForm({ ...form, emergency2: e.target.value })
              }
            />

            <button
              onClick={saveUser}
              className="w-full bg-pink-600 hover:bg-pink-700 p-4 rounded-xl font-bold text-lg"
            >
              Submit
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-5xl font-bold mb-5"
      >
        SafeShield
      </motion.h1>

      <p className="text-gray-400 mb-10 text-center">
        AI Emergency Support System
      </p>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={sendSOS}
        className="w-64 h-64 rounded-full bg-red-600 text-5xl font-bold shadow-[0_0_80px_red]"
      >
        SOS
      </motion.button>

      <p className="mt-10 text-center text-gray-400">
        Voice detection active.
        <br />
        Say HELP to send emergency alert.
      </p>
    </div>
  );
}
