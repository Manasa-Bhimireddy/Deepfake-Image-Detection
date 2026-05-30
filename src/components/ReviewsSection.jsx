import { useState, useEffect } from "react";

export default function ReviewSection() {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Fetch reviews from backend
  useEffect(() => {
    fetch("http://localhost:5002/reviews")
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, []);

  // Submit review to backend
  const submitReview = async () => {
    if (!name || !review || rating === 0) {
      alert("Fill all fields and select rating");
      return;
    }

    const res = await fetch("http://localhost:5002/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, review, rating })
    });
    const newReview = await res.json();

    setReviews(prev => [newReview, ...prev]); // update UI

    // Reset form
    setName("");
    setReview("");
    setRating(0);
    setHover(0);
  };

  // Average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star =>
    reviews.filter(r => r.rating === star).length
  );

  const getPercent = count => (reviews.length ? (count / reviews.length) * 100 : 0);

  // Rating input component
  const RatingInput = () => (
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`text-2xl cursor-pointer ${
            star <= (hover || rating) ? "text-cyan-400 scale-110" : "text-gray-600"
          }`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );

  // Star display component
  const StarDisplay = ({ value }) => (
    <div>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= value ? "text-cyan-400" : "text-gray-600"}>
          ★
        </span>
      ))}
    </div>
  );

  const formatDate = timestamp => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="py-20 px-6 text-white relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Rating Overview */}
        <div className="grid md:grid-cols-2 gap-10 mb-14">
          <div className="text-center">
            <div className="text-6xl font-bold text-cyan-400">{averageRating}</div>
            <StarDisplay value={Math.round(averageRating)} />
            <div className="text-gray-400 mt-2">{reviews.length} reviews</div>
          </div>

          {/* Progress bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star, i) => {
              const count = ratingCounts[i];
              const percent = getPercent(count);
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-6">{star}★</span>
                  <div className="flex-1 bg-gray-700 h-3 rounded">
                    <div
                      className="bg-cyan-400 h-3 rounded transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-sm text-gray-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Form */}
        <div className="relative z-10 max-w-xl mx-auto bg-black/30 p-6 rounded-xl mb-14">
          <form
            onSubmit={e => {
              e.preventDefault();
              submitReview();
            }}
          >
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full p-3 mb-4 bg-black/50 border border-white/20 rounded"
            />
            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Write review"
              className="w-full p-3 mb-4 bg-black/50 border border-white/20 rounded"
            />
            <RatingInput />
            <button type="submit" className="bg-cyan-500 px-6 py-2 rounded text-black font-semibold">
              Submit Review
            </button>
          </form>
        </div>

        {/* Reviews */}
        <div className="grid md:grid-cols-3 gap-6">
          {displayedReviews.map(item => (
            <div key={item.id} className="bg-black/30 p-5 rounded-xl border border-white/10">
              <div className="flex justify-between">
                <span className="text-cyan-400 font-semibold">{item.name}</span>
                <span className="text-xs text-gray-400">{formatDate(item.created_at)}</span>
              </div>
              <StarDisplay value={item.rating} />
              <p className="text-gray-300 mt-2">{item.review}</p>
            </div>
          ))}
        </div>

        {/* View All Reviews */}
        {reviews.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {showAll ? "Show Less" : "View All Reviews"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}