import axios from "axios";
import GoogleFitData from "../models/GoogleFitData.js";

class GoogleFitService {
  async fetchGoogleFitData(accessToken, userId) {
    const dataTypes = [
      { name: "Activity", dataTypeName: "com.google.activity.segment" },
      { name: "Body", dataTypeName: "com.google.weight" },
      { name: "Nutrition", dataTypeName: "com.google.nutrition" },
      { name: "Sleep", dataTypeName: "com.google.sleep.segment" },
      { name: "Location", dataTypeName: "com.google.location.sample" },
    ];

    const startTimeMillis = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const endTimeMillis = Date.now();

    const responses = await Promise.allSettled(
      dataTypes.map((type) =>
        axios.post(
          "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
          {
            aggregateBy: [{ dataTypeName: type.dataTypeName }],
            bucketByTime: { durationMillis: 86400000 },
            startTimeMillis,
            endTimeMillis,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
      )
    );

    const result = responses.map((response, index) => {
      if (response.status === "fulfilled") {
        const buckets = response.value.data.bucket || [];
        return {
          type: dataTypes[index].name,
          data: buckets.map((bucket) => ({
            startTime: new Date(parseInt(bucket.startTimeMillis)),
            endTime: new Date(parseInt(bucket.endTimeMillis)),
            points: bucket.dataset[0]?.point || [],
          })),
        };
      } else {
        return {
          type: dataTypes[index].name,
          error: response.reason.response?.data || response.reason.message,
        };
      }
    });

    for (const item of result) {
      if (item.data) {
        await GoogleFitData.create({
          userId,
          dataType: item.type,
          startTime: item.data[0].startTime,
          endTime: item.data[0].endTime,
          dataPoints: item.data[0].points,
        });
      }
    }

    return result;
  }

  async getStoredGoogleFitData(userId) {
    return await GoogleFitData.find({ userId }).sort({ createdAt: -1 });
  }
}

export default new GoogleFitService();
