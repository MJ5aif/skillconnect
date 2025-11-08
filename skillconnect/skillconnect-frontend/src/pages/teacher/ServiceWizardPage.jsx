import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import TeacherSidebar from '../../components/teacher/TeacherSidebar.jsx';
import { auth, db } from '../../firebase/config.js';

const steps = [
  { id: 'overview', label: 'Overview' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'description', label: 'Description & FAQ' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'publish', label: 'Publish' },
];

const packageTemplate = [
  { tier: 'Basic', name: 'Starter', description: '', delivery: '3 days', price: 49 },
  { tier: 'Standard', name: 'Growth', description: '', delivery: '5 days', price: 99 },
  { tier: 'Premium', name: 'Elite', description: '', delivery: '7 days', price: 149 },
];

const defaultFormState = {
  title: '',
  category: '',
  tags: '',
  packages: packageTemplate,
  description: '',
  faqs: [{ question: '', answer: '' }],
  thumbnailFile: null,
  thumbnailPreview: '',
  promoVideoUrl: '',
};

function ServiceWizardPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formState, setFormState] = useState(defaultFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [isFetching, setIsFetching] = useState(Boolean(serviceId));

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) {
        setIsFetching(false);
        return;
      }

      try {
        const serviceRef = doc(db, 'services', serviceId);
        const snapshot = await getDoc(serviceRef);

        if (!snapshot.exists()) {
          setLoadError('We could not find that service. You can start a new one.');
          setIsFetching(false);
          return;
        }

        const data = snapshot.data();

        setFormState((prev) => ({
          ...prev,
          title: data.title ?? '',
          category: data.category ?? '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags ?? '',
          packages: Array.isArray(data.packages) && data.packages.length === 3 ? data.packages : packageTemplate,
          description: data.description ?? '',
          faqs:
            Array.isArray(data.faqs) && data.faqs.length > 0
              ? data.faqs
              : [{ question: '', answer: '' }],
          thumbnailFile: null,
          thumbnailPreview: data.thumbnailUrl ?? '',
          promoVideoUrl: data.promoVideoUrl ?? '',
        }));
      } catch (error) {
        console.error('Failed to load service:', error);
        setLoadError('Something went wrong while loading this service.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const currentUser = auth.currentUser;

  const isEditable = useMemo(() => Boolean(currentUser), [currentUser]);

  const handleInputChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handlePackageChange = (index, field, value) => {
    setFormState((prev) => {
      const updated = prev.packages.map((pkg, pkgIndex) =>
        pkgIndex === index ? { ...pkg, [field]: field === 'price' ? Number(value) || 0 : value } : pkg,
      );
      return { ...prev, packages: updated };
    });
  };

  const handleFaqChange = (index, field, value) => {
    setFormState((prev) => {
      const updatedFaqs = prev.faqs.map((faq, faqIndex) =>
        faqIndex === index ? { ...faq, [field]: value } : faq,
      );
      return { ...prev, faqs: updatedFaqs };
    });
  };

  const handleAddFaq = () => {
    setFormState((prev) => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
  };

  const handleRemoveFaq = (index) => {
    setFormState((prev) => ({ ...prev, faqs: prev.faqs.filter((_, faqIndex) => faqIndex !== index) }));
  };

  const handleThumbnailChange = (event) => {
    const [file] = event.target.files ?? [];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormState((prev) => ({ ...prev, thumbnailFile: file, thumbnailPreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const canGoNext = useMemo(() => {
    if (currentStep === 0) {
      return Boolean(formState.title && formState.category);
    }

    if (currentStep === 1) {
      return formState.packages.every((pkg) => pkg.name && pkg.description && pkg.delivery && pkg.price > 0);
    }

    if (currentStep === 2) {
      return Boolean(formState.description);
    }

    if (currentStep === 3) {
      return Boolean(formState.thumbnailPreview);
    }

    return true;
  }, [currentStep, formState]);

  const goToNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePublish = async () => {
    if (!currentUser) {
      return;
    }

    setIsSaving(true);

    const payload = {
      title: formState.title,
      category: formState.category,
      tags: formState.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      packages: formState.packages,
      description: formState.description,
      faqs: formState.faqs.filter((faq) => faq.question && faq.answer),
      thumbnailUrl: formState.thumbnailPreview,
      promoVideoUrl: formState.promoVideoUrl,
      mentorId: currentUser.uid,
      updatedAt: serverTimestamp(),
    };

    try {
      if (serviceId) {
        const serviceRef = doc(db, 'services', serviceId);
        await setDoc(serviceRef, payload, { merge: true });
      } else {
        await addDoc(collection(db, 'services'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      navigate('/dashboard/teach/services');
    } catch (error) {
      console.error('Failed to save service:', error);
      setLoadError('Something went wrong while saving this service. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="service-title" className="block text-sm font-semibold text-gray-900">
                Service title
              </label>
              <input
                id="service-title"
                value={formState.title}
                onChange={(event) => handleInputChange('title', event.target.value)}
                placeholder="I will help you design a portfolio-ready case study"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="service-category" className="block text-sm font-semibold text-gray-900">
                  Category
                </label>
                <input
                  id="service-category"
                  value={formState.category}
                  onChange={(event) => handleInputChange('category', event.target.value)}
                  placeholder="e.g., Design Mentorship"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div>
                <label htmlFor="service-tags" className="block text-sm font-semibold text-gray-900">
                  Skill tags
                </label>
                <input
                  id="service-tags"
                  value={formState.tags}
                  onChange={(event) => handleInputChange('tags', event.target.value)}
                  placeholder="Separate tags with commas (e.g., UI/UX, Portfolio, Interviews)"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div>
            <p className="text-sm text-gray-600">
              Offer tiered packages to match different learner needs. Aim for clear feature differences between tiers.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Delivery</th>
                    <th className="px-4 py-3">Price ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {formState.packages.map((pkg, index) => (
                    <tr key={pkg.tier}>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">{pkg.tier}</td>
                      <td className="px-4 py-4">
                        <input
                          value={pkg.name}
                          onChange={(event) => handlePackageChange(index, 'name', event.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <textarea
                          value={pkg.description}
                          onChange={(event) => handlePackageChange(index, 'description', event.target.value)}
                          rows="2"
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          value={pkg.delivery}
                          onChange={(event) => handlePackageChange(index, 'delivery', event.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          min="5"
                          value={pkg.price}
                          onChange={(event) => handlePackageChange(index, 'price', event.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'description':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="service-description" className="block text-sm font-semibold text-gray-900">
                Service description
              </label>
              <textarea
                id="service-description"
                rows="6"
                value={formState.description}
                onChange={(event) => handleInputChange('description', event.target.value)}
                placeholder="Describe outcomes, mentor involvement, and deliverables"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
              <p className="mt-2 text-xs text-gray-500">Rich text editing will be added later. Markdown formatting is supported.</p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Frequently asked questions</h3>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="rounded-full bg-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-600"
                >
                  Add FAQ
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {formState.faqs.map((faq, index) => (
                  <div key={`faq-${index}`} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">FAQ {index + 1}</p>
                      {formState.faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(index)}
                          className="text-xs font-semibold text-red-500 transition hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="mt-3 space-y-3">
                      <input
                        value={faq.question}
                        onChange={(event) => handleFaqChange(index, 'question', event.target.value)}
                        placeholder="Question"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(event) => handleFaqChange(index, 'answer', event.target.value)}
                        rows="3"
                        placeholder="Answer"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-3xl bg-white/60 p-6">
              <label className="block text-sm font-semibold text-gray-900">Gig thumbnail</label>
              <p className="mt-2 text-xs text-gray-500">
                Upload a compelling cover image (16:9). Showcase the outcomes learners will achieve.
              </p>
              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 px-6 py-12 text-center transition hover:border-teal-500">
                <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                <span className="text-sm font-semibold text-teal-500">Click to upload</span>
                <span className="mt-2 text-xs text-gray-500">PNG or JPG up to 3 MB</span>
              </label>
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl bg-gray-900">
                {formState.thumbnailPreview ? (
                  <img src={formState.thumbnailPreview} alt="Thumbnail preview" className="h-48 w-full object-cover" />
                ) : (
                  <div className="flex h-48 items-center justify-center text-sm text-gray-400">
                    Preview will appear here
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="promo-video" className="block text-sm font-semibold text-gray-900">
                  Promo video URL (optional)
                </label>
                <input
                  id="promo-video"
                  value={formState.promoVideoUrl}
                  onChange={(event) => handleInputChange('promoVideoUrl', event.target.value)}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
                <p className="mt-2 text-xs text-gray-500">Paste a Loom, YouTube, or self-hosted video URL.</p>
              </div>
            </div>
          </div>
        );
      case 'publish':
        return (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Review your service</h3>
              <p className="mt-2 text-sm text-gray-600">
                Confirm the details before publishing. You can update everything later from the My Services page.
              </p>
              <dl className="mt-4 space-y-2 text-sm text-gray-700">
                <div>
                  <dt className="font-semibold text-gray-900">Title</dt>
                  <dd>{formState.title}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900">Category & Tags</dt>
                  <dd>
                    {formState.category} •{' '}
                    {formState.tags
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .join(', ')}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900">Packages</dt>
                  <dd className="mt-1 space-y-1">
                    {formState.packages.map((pkg) => (
                      <div key={pkg.tier} className="rounded-2xl bg-gray-50 p-3">
                        <p className="font-semibold text-gray-900">{pkg.tier}</p>
                        <p className="text-xs uppercase tracking-wide text-gray-400">{pkg.name}</p>
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                        <p className="text-xs text-gray-500">Delivery: {pkg.delivery} • ${pkg.price}</p>
                      </div>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
              Publishing will make this service visible to learners. You can pause or edit it anytime from the dashboard.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <TeacherSidebar />

        <main className="flex-1 pb-16">
          <header className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">
                  {serviceId ? 'Edit Service' : 'Create Service'}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                  {serviceId ? 'Update your service offering' : 'Publish a new mentoring service'}
                </h1>
                <p className="mt-3 text-sm text-gray-600">
                  Complete each step to launch a compelling SkillConnect experience. Save progress by moving between steps.
                </p>
              </div>
              <Link to="/dashboard/teach/services" className="text-sm font-semibold text-teal-500 hover:text-teal-600">
                Back to services
              </Link>
            </div>

            <ol className="mt-6 grid gap-3 md:grid-cols-5">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <li
                    key={step.id}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'border-teal-500 bg-teal-500/10 text-teal-600'
                        : isCompleted
                        ? 'border-teal-200 bg-white text-teal-500'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-wide">Step {index + 1}</span>
                    <span>{step.label}</span>
                  </li>
                );
              })}
            </ol>
          </header>

          <section className="mt-8 rounded-3xl bg-white p-8 shadow-xl">
            {isFetching ? (
              <div className="flex h-64 items-center justify-center text-sm font-semibold text-gray-500">
                Loading service...
              </div>
            ) : loadError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-500">
                {loadError}
              </div>
            ) : !isEditable ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
                Sign in as a mentor to create services.
              </div>
            ) : (
              <>
                {renderStepContent()}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={goToPrevious}
                      disabled={currentStep === 0}
                      className="rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-gray-600 transition hover:border-teal-500 hover:text-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {currentStep < steps.length - 1 && (
                      <button
                        type="button"
                        onClick={goToNext}
                        disabled={!canGoNext}
                        className="rounded-full bg-teal-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-teal-300"
                      >
                        Save & Continue
                      </button>
                    )}
                  </div>

                  {currentStep === steps.length - 1 && (
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={isSaving}
                      className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                      {isSaving ? 'Publishing...' : serviceId ? 'Update Service' : 'Publish Service'}
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ServiceWizardPage;
