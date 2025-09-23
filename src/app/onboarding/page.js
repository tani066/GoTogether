'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    username: '',
    age: '',
    location: '',
    interests: '',
    bio: '',
  });
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
    if (status === 'authenticated' && session?.user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || session.user.name || '',
        username: prev.username || session.user.username || '',
      }));
    }
  }, [status, session, router]);

  const questions = useMemo(() => (
    [
      {
        key: 'name',
        label: 'What should we call you?',
        placeholder: 'Your full name',
        type: 'text',
        required: true,
      },
      {
        key: 'username',
        label: 'Pick a unique username',
        placeholder: 'e.g. sarah_m',
        type: 'text',
        required: true,
      },
      {
        key: 'age',
        label: 'How old are you?',
        placeholder: 'e.g. 22',
        type: 'number',
        required: false,
      },
      {
        key: 'location',
        label: 'Where are you based?',
        placeholder: 'City, Country',
        type: 'text',
        required: false,
      },
      {
        key: 'interests',
        label: 'What are your interests?',
        placeholder: 'Comma separated (concerts, movies, standup)',
        type: 'text',
        required: false,
      },
      {
        key: 'bio',
        label: 'Tell people a little about you',
        placeholder: 'Short bio',
        type: 'textarea',
        required: false,
      },
    ]
  ), []);

  const totalSteps = questions.length;

  const handleNext = async () => {
    setError('');
    const q = questions[step];
    if (q?.required && !String(form[q.key]).trim()) {
      setError('This field is required');
      return;
    }
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
      return;
    }
    // Final submit
    try {
      setSaving(true);
      const res = await fetch(`/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          age: form.age ? Number(form.age) : null,
          location: form.location,
          interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
          bio: form.bio,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setDone(true);
      setTimeout(() => router.push('/dashboard'), 1600);
    } catch (e) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">GoTogether Onboarding</span>
          </div>
          {session?.user && (
            <div className="flex items-center space-x-3">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt={session.user.name || 'Avatar'} className="w-8 h-8 rounded-full border border-gray-200" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
                  {(session.user.name || 'U').slice(0,1)}
                </div>
              )}
              <span className="hidden sm:inline text-sm font-medium text-gray-700">{session.user.name || session.user.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!done ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Let's set up your profile</h1>
                <p className="text-gray-600 mt-1">Answer a few quick questions to get started</p>
              </div>
              <div className="hidden md:block text-sm text-gray-500">
                Step {step + 1} of {totalSteps}
              </div>
            </div>

            <div className="p-6 md:p-10">
              {/* Progress */}
              <div className="w-full h-2 bg-gray-100 rounded-full mb-8">
                <div
                  className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all"
                  style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
              )}

              <div className="relative min-h-[220px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={questions[step].key}
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <label className="block text-xl md:text-2xl font-semibold text-gray-900">
                      {questions[step].label}
                    </label>

                    {questions[step].type === 'textarea' ? (
                      <textarea
                        name={questions[step].key}
                        value={form[questions[step].key]}
                        onChange={handleChange}
                        rows={4}
                        placeholder={questions[step].placeholder}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <input
                        type={questions[step].type}
                        name={questions[step].key}
                        value={form[questions[step].key]}
                        onChange={handleChange}
                        placeholder={questions[step].placeholder}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        disabled={step === 0}
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition ${step === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={saving}
                        className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg disabled:opacity-50"
                      >
                        <span>{step < totalSteps - 1 ? 'Continue' : (saving ? 'Saving...' : 'Finish')}</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GoTogether!</h2>
            <p className="text-gray-600">We are setting things up and taking you to your dashboard...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}



