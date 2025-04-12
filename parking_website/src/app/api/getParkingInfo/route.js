import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = new MongoClient(
      "mongodb+srv://manoj:GQe8FoFXvXBloTUH@cluster0.7vsynme.mongodb.net/"
    );

    await client.connect();
    // console.log("Connected to MongoDB");

    // Replace with your actual database name
    const db = client.db("data"); // not client["data"]

    // Replace with your actual collection name
    const collection = db.collection("current");

    // Fetch all documents from the collection
    const data = await collection.find({}).toArray();
    // console.log("Data fetched from MongoDB:", data);

    await client.close();
    // console.log("MongoDB connection closed");

    // Return the data as JSON response
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    // console.error("Error fetching data from MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from database" },
      { status: 500 }
    );
  }
}
