import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TeacherNotice = () => {
  const navigate = useNavigate();
  const [showModel, setShowModel] = useState(false); 

  const notices = [
    {
      id: 1,
      title: "Mid-Term Exam",
      date: "10 Oct 2026",
      description: "Mid-term exams will start from 15th October.",
    },
    {
      id: 2,
      title: "Holiday Notice",
      date: "05 Oct 2026",
      description: "School will remain closed on 12th October.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-24 bg-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-(--secondary)">Notice</h1>
          <p className="mt-1 text-(--ternary)">
            Create and manage notices for students.
          </p>
        </div>
        <button onClick={() => setShowModel(true)} className="bg-(--secondary) text-white px-5 py-2 rounded-lg font-medium hover:bg-(--primary) transition ">
          + New Notice
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            className="bg-white border rounded-xl p-5 hover:shadow-lg transition"
            key={notice.id}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-(--primary)">
                {notice.title}
              </h3>
              <span className="text-sm text-(--ternary)">{notice.date}</span>
            </div>
            <p className="mt-2 text-(--ternary) text-sm">{notice.description}</p>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <button onClick={() => navigate("/teacher")} className="mt-10 text-(--secondary) font-medium hover:underline">
        ← Back to Dashboard
      </button>

      { showModel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
                <h2 className="text-xl font-bold text-(--primary)">
                    Create New Notice
                </h2>
                <form className="mt-4 space-y-4">
                    <input type="text" placeholder="Notice Title" className=" w-full px-4 py-3 border rounded-lg" />
                    <textarea placeholder="Notice Description" className="w-full px-4 py-3 border rounded-lg h-32"/>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setShowModel(false)} className="px-4 py-2 border rounded-lg text-(--ternary) ">Calcel</button>
                        <button type="button" className="px-4 py-2 bg-(--secondary) text-white rounded-lg">Public</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default TeacherNotice;
