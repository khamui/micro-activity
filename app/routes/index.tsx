import React from "react";
import { useLoaderData } from "remix";
import { Activity } from "./activity";
import { ActivitiesService } from "../services/ActivitiesService"

export const loader = async () => {
  const AS = new ActivitiesService()
  return await AS.loader()
};

export default function Index() {
  const activities = useLoaderData();
  return (
    <div className="page-container">
      <div className="activities-container collapsed">
        {activities.map((activity: any, idx: number) => (
          <Activity key={`activity_${idx}`} data={activity} />
        ))}
      </div>
    </div>
  );
}
