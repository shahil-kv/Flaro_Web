"use client";
import { useParams } from "next/navigation";

export default function SubItemPage() {
  const { subItem } = useParams();

  if (!subItem) {
    return <div>No subItem provided.</div>;
  }

  const displayName = subItem;
  const dummyData = {
    "all-calls": "You have 10 total calls today.",
    "missed-calls": "You missed 3 calls today.",
    "recent-calls": "You have 5 recent calls in the last hour.",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">{displayName}</h1>
      <p className="text-gray-400">
        {dummyData[subItem as keyof typeof dummyData] || "No data available."}
      </p>
    </div>
  );
}
