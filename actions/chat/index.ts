// TOOD - these need to be made into server functions
// ideally can use nextjs functions

export const sendMessage = async (
	query: string,
	uid: string,
	existingThreadId?: string,
) => {
	// let assistantId = null;
	// try {
	// 	// check for existing assistant
	// 	const { data } = await supabase
	// 		.from("users")
	// 		.select("*")
	// 		.eq("id", uid)
	// 		.single();
	// 	if (!data.assistant_id) {
	// 		const assistant = await createAssistant(uid);
	// 		if (!assistant) {
	// 			throw new Error(
	// 				"Failed to create assistant and cannot find existing assistant.",
	// 			);
	// 		}
	// 		const { data, error } = await supabase
	// 			.from("users")
	// 			.update({ assistant_id: assistant.id })
	// 			.eq("id", uid)
	// 			.single();
	// 		assistantId = assistant.id;
	// 	} else {
	// 		assistantId = data.assistant_id;
	// 	}
	// 	// get thread id
	// 	let threadId = existingThreadId;
	// 	if (!threadId) {
	// 		console.log("Creating new thread");
	// 		const thread = await createThread(uid, assistantId);
	// 		if (!thread) {
	// 			throw new Error("Failed to create thread.");
	// 		}
	// 		threadId = thread.id;
	// 	}
	// 	if (!threadId) {
	// 		throw new Error("Failed to create thread.");
	// 	}
	// 	console.log("Thread ID", threadId);
	// 	// send message
	// 	const runData = {
	// 		assistant_id: assistantId,
	// 		stream: true,
	// 	};
	// 	try {
	// 		const response = await fetch(
	// 			`https://api.openai.com/v1/threads/${threadId}/runs`,
	// 			{
	// 				method: "POST",
	// 				headers: {
	// 					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
	// 					"Content-Type": "application/json",
	// 					"OpenAI-Beta": "assistants=v2",
	// 				},
	// 				body: JSON.stringify(runData),
	// 			},
	// 		);
	// 		const runResult = await response.json();
	// 		if (!response.ok) {
	// 			throw new Error(`Failed to create run: ${runResult.error.message}`);
	// 		}
	// 		console.log("runResult", runResult);
	// 		return runResult;
	// 	} catch (error) {
	// 		console.error("Error sending message:", error);
	// 		throw new Error("Error in sending message through OpenAI.");
	// 	}
	// } catch (error) {
	// 	console.error("Error in sendMessage:", error);
	// 	return false;
	// }
};

const createAssistant = async (uid: string) => {
	// const oasisPaths = {
	// 	"All bottled water": `/search/bottled-waters`,
	// 	"All filters": `/search/filters`,
	// 	"All tap water": `/search/tap-water`,
	// };
	// const assistantData = {
	// 	instructions: `You are a clean drinking water and healthy product longevity companion, scientist, and expert.
	//   Users ask you about specific water items or general questions about research and health. Provide them with research backed, concise answers to lead them to a healthy lifestyle.
	//   Reply in markdown to format including data but sounding like a human conversation. Keep your answers brief.
	//   Prioritze data from Oasis. And display the relevant data in your answer in addition to the helpful links for the user to learn more.`,
	// };
	// console.log(
	// 	"process.env.OPENAI_API_KEY",
	// 	process.env.EXPO_PUBLIC_OPENAI_API_KEY,
	// );
	// try {
	// 	const response = await fetch("https://api.openai.com/v1/assistants", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
	// 			"OpenAI-Beta": "assistants=v2",
	// 		},
	// 		body: JSON.stringify(assistantData),
	// 	});
	// 	console.log("response", response);
	// 	const assistant = await response.json();
	// 	if (!response.ok) {
	// 		throw new Error(`HTTP error! status: ${response.status}`);
	// 	}
	// 	return assistant;
	// } catch (error) {
	// 	console.error("Failed to create assistant", error);
	// 	return false;
	// }
};

const createThread = async (uid: string, assistantId: string) => {
	// try {
	// 	const response = await fetch("https://api.openai.com/v1/threads", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
	// 			"OpenAI-Beta": "assistants=v2",
	// 		},
	// 		body: JSON.stringify({
	// 			user: uid,
	// 			assistant: assistantId,
	// 		}),
	// 	});
	// 	const thread = await response.json();
	// 	if (!response.ok) {
	// 		throw new Error(`HTTP error! status: ${response.status}`);
	// 	}
	// 	return thread;
	// } catch (error) {
	// 	console.error("Failed to create thread", error);
	// 	return false;
	// }
};
