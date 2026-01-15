import ProtectedSettingsProfile from "@/components/protected/settings/protected-settings-profile";
import { Profile } from "@/types/collection";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const revalidate = 0;

async function getUserId() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.log("Error has occured while getting UserId!");
    console.log("Error message : ", error.message);
    return null;
  }

  return user ? user.id : null;
}

const SettingsPage = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const userId = await getUserId();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .match({ id: userId })
    .single<Profile>();

  if (error) {
    console.log(error);
    throw Error;
  }

  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-3xl px-10">
      <ProtectedSettingsProfile user={data} />
    </div>
  );
};

export default SettingsPage;
