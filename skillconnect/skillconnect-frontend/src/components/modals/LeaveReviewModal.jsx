import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config.js';

function LeaveReviewModal({ course, onClose, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!course) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      setErrorMessage('Please share a few words about your experience.');
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      setErrorMessage('Please sign in to share your review.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const reviewCollection = collection(db, 'courses', course.id, 'reviews');

      await addDoc(reviewCollection, {
        courseId: course.id,
        courseTitle: course.title,
        mentor: course.mentor,
        rating,
        comment: comment.trim(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        createdAt: serverTimestamp(),
      });

      if (typeof onSubmitted === 'function') {
        onSubmitted();
      }

      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
      setErrorMessage('Something went wrong while saving your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Share your feedback</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">How was your experience?</h2>
            <p className="mt-2 text-sm text-gray-600">{course.title}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">with {course.mentor}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 transition hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-900">Overall rating</p>
            <div className="mt-3 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const active = hoverRating ?? rating;
                return (
                  <button
                    key={`star-${starValue}`}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="transition"
                  >
                    <FaStar
                      className={`${starValue <= active ? 'text-amber-400' : 'text-gray-300'} h-8 w-8`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="review-comment" className="block text-sm font-semibold text-gray-900">
              Your review
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share your experience... what did you learn, and how was the teacher?"
              rows="5"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-inner focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </div>

          {errorMessage && <p className="text-sm font-semibold text-red-500">{errorMessage}</p>}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-gray-600 transition hover:border-brand-blue hover:text-brand-blue"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeaveReviewModal;
