import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ContactSubmission, ApiResponse } from "@/../types/contact";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get client IP for tracking (optional)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIP || "unknown";

    // Parse and validate request body
    const body = await request.json();
    const { name, email, message }: ContactSubmission = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "All fields are required.",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.trim().length > 255 || email.trim().length > 255) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Name and email must be less than 255 characters.",
        },
        { status: 400 }
      );
    }

    if (message.trim().length > 2000) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Message must be less than 2000 characters.",
        },
        { status: 400 }
      );
    }

    // Get user agent for tracking
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Insert into Supabase using public client (no auth required)
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        ip_address: ip,
        user_agent: userAgent,
        status: "unread",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Failed to submit your message. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<ContactSubmission>>(
      {
        success: true,
        data: data,
        message:
          "Thank you! Your message has been sent successfully. We will get back to you soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const status = searchParams.get("status") || "all";

    const offset = (page - 1) * limit;

    let query = supabase
      .from("contact_submissions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status !== "all" && ["unread", "read", "replied"].includes(status)) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Failed to retrieve submissions.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<
      ApiResponse<{
        submissions: ContactSubmission[];
        total: number;
        page: number;
        limit: number;
      }>
    >(
      {
        success: true,
        data: {
          submissions: data || [],
          total: count || 0,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
