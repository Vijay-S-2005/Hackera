import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get vehicle number from query params
    const { searchParams } = new URL(request.url);
    const vehicleNumber = searchParams.get('vehicleNumber');
    
    const client = new MongoClient(
      "mongodb+srv://manoj:GQe8FoFXvXBloTUH@cluster0.7vsynme.mongodb.net/"
    );

    await client.connect();

    const db = client.db("data");
    const collection = db.collection("historical data");

    // Create query filter based on vehicle number if provided
    const query = vehicleNumber ? { vehicle_number: vehicleNumber } : {};
    
    // Fetch documents matching the query
    const data = await collection.find(query).toArray();

    await client.close();

    // Return the data as JSON response
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from database" },
      { status: 500 }
    );
  }
}
