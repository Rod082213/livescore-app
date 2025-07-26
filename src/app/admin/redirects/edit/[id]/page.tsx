import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Redirect from '@/models/Redirect';
import mongoose from 'mongoose';

type RedirectDocument = {
  _id: string;
  source: string;
  destination: string;
};

async function updateRedirect(formData: FormData) {
    'use server';
    const id = formData.get('id')?.toString();
    const source = formData.get('source')?.toString();
    const destination = formData.get('destination')?.toString();

    if (!id || !source || !destination) {
        throw new Error('Required fields are missing.');
    }
    
    await dbConnect();
    await Redirect.findByIdAndUpdate(id, { source, destination });

    revalidatePath('/admin/redirects');
    redirect('/admin/redirects');
}

async function fetchRedirectById(id: string): Promise<RedirectDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }
    await dbConnect();
    const redirectData = await Redirect.findById(id).lean();
    if (!redirectData) {
        return null;
    }
    return JSON.parse(JSON.stringify(redirectData));
}

export default async function EditRedirectPage({ params }: { params: { id: string } }) {
    const redirectData = await fetchRedirectById(params.id);

    if (!redirectData) {
        notFound();
    }

    return (
        <div className="bg-slate-900 min-h-screen p-4 sm:p-6 md:p-8 text-white flex justify-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">Edit Redirect</h1>
                <div className="bg-slate-800 p-8 rounded-lg shadow-xl">
                    <form action={updateRedirect} className="space-y-6">
                        <input type="hidden" name="id" value={redirectData._id} />
                        <div>
                            <label htmlFor="source" className="block text-sm font-medium text-gray-300 mb-2">
                                Source Path
                            </label>
                            <div className="flex items-center rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 h-full text-gray-400 bg-gray-700 border border-r-0 border-gray-600 rounded-l-md">
                                    todaylivescores.com
                                </span>
                                <input
                                    type="text"
                                    name="source"
                                    id="source"
                                    required
                                    defaultValue={redirectData.source}
                                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="destination" className="block text-sm font-medium text-gray-300 mb-2">
                                Destination URL (Link)
                            </label>
                            <input
                                type="url"
                                name="destination"
                                id="destination"
                                required
                                defaultValue={redirectData.destination}
                                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}