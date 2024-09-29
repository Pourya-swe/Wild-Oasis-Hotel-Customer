"use server";
import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

// Note: All this is gonna do is to call that signIn function from "Auth.js" library.
export async function signInAction() {
  // Note: If we had multiple providers then we need to loop over those to make these dynamic. "GET/providers"  that we exported from "NextAuth".
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuest(formData) {
  // Note: We always need to make sure of two things
  //// 1) User who is invoking this server action actually has the authorization of doing this
  //// 2) We need to always treat all the inputs as unsafe.
  const session = await auth();

  // Note: It's common pratice not to use a "try/catch" declaration, but instead we simply throw errors right here in the function body and then they be caught by the closest "Error boudary".
  if (!session) throw new Error("You must be logged in");

  // Note: "formData" is just a Web API that also works in a browser.
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = {
    nationality,
    countryFlag,
    nationalID,
  };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  // Note: We want to refresh the route cache on-deman - not time based - whenever we run this updatedr function.
  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  console.log("formData", formData);
  console.log("bookingData", bookingData);
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // Note: If we had lots of data in the formData, we could create object right away by doing this
  // Object.entries(formData.entries());

  // Note: We can use a library like "ZOD" for validation.
  // Todo: Input validation on the back-end
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: +formData.get("numGuests"),
    observations: formData.get("observations").slice(0, 1000),
    extraPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  // Todo: Checking the already booked date on the back-end just like the fornt-end we did on the date picker.

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    console.log(error);
    throw new Error("Booking could not be created");
  }

  // Note: We want to rerender the dataPicker after we booked a date based on this server action.
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //// Implementing back-end safety.
  // Note: We want to allow user only delete their own reservations, otherwise they can delete any reservation they want buy simply requesting it.
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const bookingId = +formData.get("bookingId");

  //// 1) Checking Authentication & Authorization
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //// 2) Implementing Back-End Safety (Making sure that they are updating their own booking)
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  //// 3) Updating the Reservation
  const updateData = {
    numGuests: +formData.get("numGuests"),
    // Note: Making sure that can not send string more than a specific number.
    observations: formData.get("observations").slice(0, 1000),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be updated");

  //// Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  //// Redirecting
  redirect("/account/reservations");
}
