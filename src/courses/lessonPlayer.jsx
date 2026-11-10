
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function LessonPlayer() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const playerSectionRef = useRef(null);

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [error, setError] = useState("");
  const [playbackRate, setPlaybackRate] = useState("1");

  const completedCount = completedLessons.length;

  const progress = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  // Load lessons and saved progress
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [lessonsResponse, progressResponse] = await Promise.all([
          fetch(
            `/api/courses/lessons.php?slug=${encodeURIComponent(slug)}`,
            { credentials: "include", cache: "no-store" }
          ),
          fetch(
            `/api/courses/progress.php?slug=${encodeURIComponent(slug)}`,
            { credentials: "include", cache: "no-store" }
          )
        ]);

        const lessonsData = await lessonsResponse.json();
        const progressData = await progressResponse.json();

        if (!lessonsResponse.ok || !lessonsData.success) {
          throw new Error(
            lessonsData.message || "Unable to load lessons."
          );
        }

        if (!progressResponse.ok || !progressData.success) {
          throw new Error(
            progressData.message || "Unable to load progress."
          );
        }

        if (!cancelled) {
          setLessons(lessonsData.lessons || []);
          setCompletedLessons(
            (progressData.completed_lessons || []).map(Number)
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Scroll to player after selected lesson is rendered on mobile
  useEffect(() => {
    if (!selectedLesson || window.innerWidth >= 1024) return;

    const scrollTimer = window.requestAnimationFrame(() => {
      playerSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => {
      window.cancelAnimationFrame(scrollTimer);
    };
  }, [selectedLesson]);

  // Verify lesson access before loading video
  const openLesson = async (lesson) => {
    try {
      setVideoLoading(true);
      setError("");
      setSelectedLesson(null);
      setPlaybackRate("1");

      const response = await fetch(
        `/api/courses/video.php?lesson_id=${encodeURIComponent(lesson.id)}`,
        {
          credentials: "include",
          cache: "no-store"
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to access this lesson.");
      }

      setSelectedLesson(data.lesson);

    } catch (err) {
      setError(err.message);
    } finally {
      setVideoLoading(false);
    }
  };

  // Mark lesson complete
  const markComplete = async () => {
    if (!selectedLesson || markingComplete) return;

    try {
      setMarkingComplete(true);
      setError("");

      const response = await fetch("/api/courses/progress.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lesson_id: selectedLesson.id
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save progress.");
      }

      setCompletedLessons((previous) =>
        previous.includes(Number(selectedLesson.id))
          ? previous
          : [...previous, Number(selectedLesson.id)]
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setMarkingComplete(false);
    }
  };

  // Change video playback speed
  const changeSpeed = (value) => {
    setPlaybackRate(value);

    if (videoRef.current) {
      videoRef.current.playbackRate = Number(value);
    }
  };

  // Fullscreen
  const handleFullscreen = async () => {
    if (!videoRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await videoRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b14] text-white flex items-center justify-center">
        Loading lessons...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b14] text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">

        <button
          onClick={() => navigate("/my-learning")}
          className="mb-6 text-purple-400 hover:text-purple-300"
        >
          ← Back to My Learning
        </button>

        <h1 className="text-3xl font-bold mb-2">
          Course Lessons
        </h1>

        <p className="text-gray-400 mb-6">
          Select a lesson and start learning.
        </p>

        {/* Course Progress */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3 gap-3">
            <h2 className="font-semibold">Your Learning Progress</h2>
            <span className="text-purple-400 font-bold">
              {progress}%
            </span>
          </div>

          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-gray-400 text-sm mt-3">
            {completedCount} of {lessons.length} lessons completed
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Lessons Sidebar */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
            <h2 className="text-xl font-semibold mb-5">
              Course Content ({lessons.length})
            </h2>

            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(
                  Number(lesson.id)
                );

                return (
                  <button
                    key={lesson.id}
                    onClick={() => openLesson(lesson)}
                    disabled={videoLoading}
                    className={`w-full text-left p-4 rounded-xl border transition ${
                      Number(selectedLesson?.id) === Number(lesson.id)
                        ? "bg-purple-600/20 border-purple-500"
                        : "bg-white/5 border-white/10 hover:border-purple-500/50"
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-purple-400 font-bold">
                          {index + 1}.
                        </span>
                        <span className="text-sm font-medium">
                          {lesson.title}
                        </span>
                      </div>

                      {isCompleted && (
                        <span className="text-green-400 text-xs shrink-0">
                          ✓ Done
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Video Player */}
          <div
            ref={playerSectionRef}
            className="lg:col-span-2 bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6 scroll-mt-28"
          >

            {videoLoading ? (
              <div className="py-24 text-center text-gray-400">
                Verifying lesson access...
              </div>
            ) : selectedLesson ? (
              <>
                <h2 className="text-2xl font-bold mb-3">
                  {selectedLesson.title}
                </h2>

                <p className="text-gray-400 mb-6">
                  {selectedLesson.description}
                </p>

                <div className="bg-black rounded-xl overflow-hidden border border-white/10">
                  <video
                    key={selectedLesson.id}
                    ref={videoRef}
                    controls
                    playsInline
                    preload="metadata"
                    controlsList="nodownload"
                    className="w-full aspect-video"
                    src={`/api/courses/video-stream.php?lesson_id=${encodeURIComponent(selectedLesson.id)}`}
                    onError={() => {
                      setError(
                        "Video play nahi ho pa rahi. Streaming API aur server response check karein."
                      );
                    }}
                  >
                    Your browser does not support HTML5 video.
                  </video>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="playback-speed"
                      className="text-gray-400 text-sm"
                    >
                      Playback Speed
                    </label>

                    <select
                      id="playback-speed"
                      value={playbackRate}
                      onChange={(e) => changeSpeed(e.target.value)}
                      className="bg-[#080b14] border border-white/20 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="1.75">1.75x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>

                  <button
                    onClick={handleFullscreen}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Fullscreen
                  </button>
                </div>

                {/* Completion Button */}
                <div className="mt-6 border-t border-white/10 pt-5">
                  {completedLessons.includes(Number(selectedLesson.id)) ? (
                    <div className="text-green-400 font-semibold">
                      ✓ Lesson Completed
                    </div>
                  ) : (
                    <button
                      onClick={markComplete}
                      disabled={markingComplete}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-5 py-3 rounded-xl font-semibold"
                    >
                      {markingComplete
                        ? "Saving..."
                        : "✓ Mark as Complete"}
                    </button>
                  )}
                </div>

                <p className="text-gray-500 text-xs mt-5">
                  Your course access is verified. Enjoy learning!
                </p>
              </>
            ) : (
              <div className="py-24 text-center">
                <div className="text-5xl mb-4">🎬</div>

                <h2 className="text-xl font-semibold mb-2">
                  Select a Lesson
                </h2>

                <p className="text-gray-400">
                  Choose a lesson from the left side to start watching.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
