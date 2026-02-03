"use client";

import { useState } from "react";
import { Star, Edit2, Trash2, X } from "lucide-react";
import { Review } from "@/types";
import {
  createReview,
  updateReview,
  deleteReview,
} from "@/actions/review.action";
import { ReviewCreateData } from "@/services/review.service";

interface ReviewSectionProps {
  reviews: Review[];
  mealId: string;
  currentUserId?: string;
  currentUserRole?: string;
}

export function ReviewSection({
  reviews: initialReviews,
  mealId,
  currentUserId,
  currentUserRole,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Permission checks
  const isCustomer = currentUserRole === "CUSTOMER";
  const isAdmin = currentUserRole === "ADMIN";

  // Find user's existing review
  const userReview = reviews.find(
    (review) => review.customer?.id === currentUserId
  );
  const hasUserReviewed = !!userReview;

  const handleStartReview = () => {
    if (!isCustomer) {
      setError("Only customers can write reviews");
      return;
    }

    setIsAddingReview(true);
    setEditingReviewId(null);
    setRating(5);
    setComment("");
    setError(null);
    setSuccess(null);
  };

  const handleEditReview = (review: Review) => {
    if (!isCustomer) {
      setError("Only customers can edit reviews");
      return;
    }

    if (review.customer?.id !== currentUserId) {
      setError("You can only edit your own reviews");
      return;
    }

    setEditingReviewId(review.id);
    setIsAddingReview(false);
    setRating(review.rating || 5);
    setComment(review.comment || "");
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsAddingReview(false);
    setEditingReviewId(null);
    setRating(5);
    setComment("");
    setError(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCustomer) {
      setError("Only customers can submit reviews");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingReviewId) {
        // Update existing review
        const result = await updateReview(editingReviewId, {
          rating,
          comment,
        });

        if (result.error) {
          setError(result.error.message);
        } else {
          setSuccess("Review updated successfully!");
          // Update the review in the list
          setReviews(
            reviews.map((r) =>
              r.id === editingReviewId
                ? { ...r, rating, comment, updatedAt: new Date() }
                : r
            )
          );
          handleCancelEdit();
          setTimeout(() => setSuccess(null), 3000);
        }
      } else {
        // Create new review
        const reviewData: ReviewCreateData = {
          rating,
          comment,
          mealId,
        };

        const result = await createReview(reviewData);

        if (result.error) {
          setError(result.error.message);
        } else if (result.data) {
          setSuccess("Review added successfully!");
          // Add the new review to the list
          setReviews([result.data, ...reviews]);
          handleCancelEdit();
          setTimeout(() => setSuccess(null), 3000);
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!isAdmin) {
      setError("Only administrators can delete reviews");
      return;
    }

    if (!confirm("Are you sure you want to delete this review?")) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await deleteReview(reviewId);

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess("Review deleted successfully!");
        // Remove the review from the list
        setReviews(reviews.filter((r) => r.id !== reviewId));
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (
    currentRating: number,
    interactive: boolean = false,
    size: string = "w-5 h-5"
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            className={`${interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}`}
          >
            <Star
              className={`${size} ${
                star <= (interactive && hoveredStar ? hoveredStar : currentRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          Reviews
          {reviews.length > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-500">
              ({reviews.length})
            </span>
          )}
        </h2>

        {/* Only show "Write a Review" button to customers who haven't reviewed yet */}
        {isCustomer && !hasUserReviewed && !isAddingReview && (
          <button
            onClick={handleStartReview}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-800">
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Add/Edit Review Form - Only for CUSTOMER role */}
      {(isAddingReview || editingReviewId) && isCustomer && (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {editingReviewId ? "Edit Your Review" : "Write Your Review"}
            </h3>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            {renderStars(rating, true, "w-6 h-6")}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Share your experience with this meal..."
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading
                ? "Submitting..."
                : editingReviewId
                  ? "Update Review"
                  : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <ul className="space-y-5">
          {reviews.map((review: Review) => {
            const isUserReview = review.customer?.id === currentUserId;
            const canEdit = isCustomer && isUserReview;
            const canDelete = isAdmin;

            return (
              <li key={review.id} className="border-b last:border-b-0 pb-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {review.customer?.name || "Anonymous"}
                      </span>
                      {isUserReview && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating || 0)}
                      <span className="text-sm font-medium text-gray-600">
                        {review.rating?.toFixed(1) || "N/A"}
                      </span>
                    </div>

                    {review.comment && (
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.createdAt || "").toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action buttons based on role */}
                  {(canEdit || canDelete) && !isAddingReview && !editingReviewId && (
                    <div className="flex gap-2 ml-4">
                      {/* Edit button - only for customer's own review */}
                      {canEdit && (
                        <button
                          onClick={() => handleEditReview(review)}
                          disabled={loading}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Edit review"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Delete button - only for admin */}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title={isAdmin ? "Delete review (Admin)" : "Delete review"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm mb-4">
            No reviews yet. Be the first to review this meal 🍽️
          </p>
          {!isCustomer && currentUserId && (
            <p className="text-xs text-gray-400">
              (Only customers can write reviews)
            </p>
          )}
        </div>
      )}
    </div>
  );
}