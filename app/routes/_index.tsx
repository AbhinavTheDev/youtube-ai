import {
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { Spinner } from "@chakra-ui/spinner";
import { type ActionFunctionArgs, type LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { Logo } from "assets/icons/logo";
import { youtube_ai_flow } from "~/services/youtube.server";

// Protect the page on the server
export async function loader({ request }: LoaderFunctionArgs) {
  const { requireUser } = await import("~/services/auth.server");
  const user = await requireUser(request); // redirects to /login if not authenticated
  // Return minimal user data to show in the modal
  return json({
    user: { name: (user as any).name, email: (user as any).email },
  });
}

// Protect the action too
export async function action({ request }: ActionFunctionArgs) {
  try {
    const { requireUser } = await import("~/services/auth.server");
    await requireUser(request);

    const formData = await request.formData();
    const userPrompt = formData.get("prompt")?.toString();
    const url = formData.get("video-url")?.toString();

    if (!url || !userPrompt) {
      return json(
        { error: "Please provide a URL and a prompt." },
        { status: 400 }
      );
    }

    const output = await youtube_ai_flow({ prompt: userPrompt, ytUrl: url });
    return json({ output });
  } catch (error: any) {
    console.error(error);
    return json(
      { error: error.message || "An unknown error occurred." },
      { status: 500 }
    );
  }
}

// UI
export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  const initialPlaceholder = (
    <div className="text-center text-gray-500">
      <p className="mt-2 text-sm">YouTube video will appear here</p>
    </div>
  );

  const [videoPreview, setVideoPreview] = useState<ReactNode>(initialPlaceholder);
  const [isCopied, setIsCopied] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const regex = /(?:v=|\/embed\/|\/watch\?v=|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);

    if (match) {
      const videoId = match[1];
      setVideoPreview(
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt="YouTube Video Preview"
          className="w-full h-auto rounded-md"
        />
      );
    } else {
      setVideoPreview(
        <div className="text-center text-red-500">
          <p className="font-semibold">Invalid YouTube URL</p>
          <p className="text-sm mt-1">Please enter a valid YouTube video URL</p>
        </div>
      );
    }
  };

  const handleCopy = async () => {
    if (actionData?.output && !isCopied) {
      await navigator.clipboard.writeText(actionData.output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo width="110px" height="60px" />
            <h1 className="text-2xl font-bold text-gray-700">Youtube AI</h1>
          </div>

          {/* Account button */}
          <button
            type="button"
            onClick={() => setShowAccount(true)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <span className="i-ph-user-circle text-lg" />
            Account
          </button>
        </header>

        {/* Account modal */}
        {showAccount && (
          <div
            className="fixed inset-0 z-50"
            onClick={() => setShowAccount(false)}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div
              className="absolute right-4 top-16 w-80 rounded-lg bg-white shadow-lg border p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="font-medium text-gray-800">{user?.name || "Account"}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowAccount(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                {/* Future account settings links go here */}
                <Form method="post" action="/logout">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Logout
                  </button>
                </Form>
              </div>
            </div>
          </div>
        )}

        {/* Main */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full p-8 flex-grow sm:overflow-hidden">
          {/* Input */}
          <section className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:overflow-y-auto">
            <Form method="post" className="space-y-4">
              <div>
                <label htmlFor="video-url" className="block text-md font-medium text-gray-700">
                  YouTube Video URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="video-url"
                    id="video-url"
                    required
                    onChange={handleUrlChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Enter YouTube video URL"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="prompt" className="block text-md font-medium text-gray-700">
                  AI Prompt
                </label>
                <div className="mt-1">
                  <textarea
                    name="prompt"
                    id="prompt"
                    required
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Enter your prompt for the AI"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Spinner size="sm" className="mr-2" color="white" />}
                  Generate
                </button>
              </div>
            </Form>

            <div
              id="frame-box"
              className="mt-6 flex-grow bg-gray-200 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 min-h-[300px] overflow-hidden"
            >
              {videoPreview}
            </div>
          </section>

          {/* Output */}
          <section className="bg-white p-6 rounded-lg shadow-md flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h2 className="text-2xl font-semibold text-gray-700">AI Output</h2>
              {actionData?.output && !isSubmitting && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  disabled={isCopied}
                >
                  {isCopied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>

            <div className="output-box bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-wrap font-mono text-sm flex-grow overflow-y-auto">
              {actionData?.output && !isSubmitting && <p>{actionData.output}</p>}
              {!actionData?.output && !isSubmitting && !actionData?.error && (
                <p className="text-gray-400">Your AI Output will appear here.</p>
              )}
              {isSubmitting && <p className="text-center text-gray-500 mt-8">Generating response...</p>}
              {actionData?.error && <p className="text-center text-red-500 mt-8">Error: {actionData.error}</p>}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
