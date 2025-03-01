import React from "react";

interface LoadingStateProps {
  count?: number;
}

const Loading = ({ count = 4 }: LoadingStateProps) => {
  return (
    <div className="loading-book-container">
      {Array.from({ length: count }).map((_, index) => (
        <div className="loading-book-card">
          <div className="loading-book-card-image-container">
            <div className="loading-book-card-image shimmer"></div>
          </div>

          <div className="loading-book-content">
            <div className="loading-book-content-info">
              <div className="loading-text-line loading-title shimmer"></div>
              <div className="loading-text-line loading-description shimmer"></div>
              <div className="loading-text-line loading-description shimmer"></div>

              <div className="loading-book-meta">
                <div className="loading-text-line loading-meta shimmer"></div>
                <div className="loading-text-line loading-meta shimmer"></div>
                <div className="loading-text-line loading-meta shimmer"></div>
              </div>
            </div>

            <div className="loading-wishlist-button shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;
