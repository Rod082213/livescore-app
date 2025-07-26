import dbConnect from '@/lib/mongodb';
import Redirect from '@/models/Redirect';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { LinkIcon } from 'lucide-react';

type RedirectDocument = {
  _id: string;
  source: string;
  destination: string;
};

async function addRedirect(formData: FormData) {
    'use server';
    const source = formData.get('source')?.toString();
    const destination = formData.get('destination')?.toString();
    if (!source || !destination || !source.startsWith('/')) {
        throw new Error('Invalid input.');
    }
    await dbConnect();
    await Redirect.create({ source, destination });
    revalidatePath('/admin/redirects');
}

async function deleteRedirect(formData: FormData) {
    'use server';
    const id = formData.get('id')?.toString();
    if (!id) throw new Error('Missing ID.');
    await dbConnect();
    await Redirect.findByIdAndDelete(id);
    revalidatePath('/admin/redirects');
}

export default async function RedirectsPage() {
    await dbConnect();
    const rawRedirects = await Redirect.find({}).sort({ createdAt: -1 }).lean();
    
    const redirects: RedirectDocument[] = rawRedirects.map(doc => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return (
        <div className="bg-slate-900 min-h-screen p-4 sm:p-6 md:p-8 text-white">
            <h1 className="text-3xl font-bold mb-8">Redirect Manager</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-transparent p-0">
                    <h2 className="text-xl font-bold text-white mb-6">Create New Redirect</h2>
                    <form action={addRedirect} className="space-y-6">
                        <div>
                            <label htmlFor="source" className="block text-sm font-medium text-gray-300 mb-2">
                                Source Path
                            </label>
                            <div className="flex items-center rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 h-full text-gray-400 bg-gray-800 border border-r-0 border-gray-600 rounded-l-md">
                                    todaylivescores.com
                                </span>
                                <input
                                    type="text"
                                    name="source"
                                    id="source"
                                    placeholder="/my-old-post"
                                    required
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
                                placeholder="https://example.com/new-destination"
                                required
                                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300"
                            >
                                Add Redirect
                            </button>
                        </div>
                    </form>
                </div>
                <div className="bg-transparent p-0">
                    <h2 className="text-xl font-bold text-white mb-6">Current Redirects</h2>
                    <div className="space-y-4">
                        {redirects.length > 0 ? (
                            redirects.map((redirect) => (
                                <div key={redirect._id} className="bg-slate-800 p-4 rounded-lg shadow-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <LinkIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="font-semibold text-white break-all">{redirect.source}</p>
                                                <p className="text-sm text-gray-400 break-all mt-1">{redirect.destination}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                                            <Link href={`/admin/redirects/edit/${redirect._id}`} className="font-medium text-blue-400 hover:text-blue-300 text-sm">
                                                Edit
                                            </Link>
                                            <form action={deleteRedirect}>
                                                <input type="hidden" name="id" value={redirect._id} />
                                                <button type="submit" className="font-medium text-red-500 hover:text-red-400 text-sm">
                                                    Delete
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-slate-800 p-8 rounded-lg text-center text-gray-400">
                                No redirects have been created yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}