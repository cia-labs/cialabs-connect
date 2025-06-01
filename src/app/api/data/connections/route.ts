import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  // Validate UID parameter
  if (!uid) {
    return new Response(JSON.stringify({ error: 'UID parameter is required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Step 1: Get all scanned_user UUIDs from qr_interactions where scanned_by = uid
  const { data: qrInteractions, error: qrError } = await supabase
    .from('qr_interactions')
    .select('scanned_user')
    .eq('scanned_by', uid);

  if (qrError) {
    return new Response(JSON.stringify({ error: qrError.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // If no interactions found
  if (!qrInteractions || qrInteractions.length === 0) {
    return new Response(JSON.stringify({ message: 'No QR interactions found', data: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Step 2: Extract unique scanned_user UUIDs
  const scannedUserIds = [...new Set(qrInteractions.map(interaction => interaction.scanned_user))];

  // Step 3: Get profile details for all scanned users
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('user_id, full_name, profile_img, branch')
    .in('user_id', scannedUserIds);

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Step 4: Combine the data and include scan count for each user
  const profilesWithScanCount = profiles.map(profile => {
    const scanCount = qrInteractions.filter(
      interaction => interaction.scanned_user === profile.user_id
    ).length;

    return {
      user_id: profile.user_id,
      full_name: profile.full_name,
      profile_img: profile.profile_img,
      branch: profile.branch,
      scan_count: scanCount
    };
  });

  return new Response(JSON.stringify({
    message: 'QR interactions retrieved successfully',
    data: profilesWithScanCount,
    total_users: profilesWithScanCount.length,
    total_scans: qrInteractions.length
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}