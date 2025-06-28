import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

type Props = {
	onSubmit?: (file: File) => void;
	accept?: string;
};

const videoConstraints = { facingMode: "user", width: 640, height: 480 };

const UpdatePhoto: React.FC<Props> = ({
	onSubmit,
	accept = "image/png,image/jpeg,image/jpg",
}) => {
	const webcamRef = useRef<Webcam>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	/** Capture a frame from the webcam as a Blob/File */
	const capture = useCallback(() => {
		const screenshot = webcamRef.current?.getScreenshot();
		if (!screenshot) return;

		// convert base64 screenshot → File
		fetch(screenshot)
			.then((res) => res.blob())
			.then((blob) => {
				const capturedFile = new File([blob], `capture-${Date.now()}.png`, {
					type: "image/png",
				});
				setPreview(URL.createObjectURL(capturedFile));
				setFile(capturedFile);
			});
	}, [onSubmit]);

	/** Handle manual file upload */
	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;
		setPreview(URL.createObjectURL(f));
		setFile(f);
	};

	/** Reset state to let user retake / choose again */
	const reset = () => {
		setPreview(null);
		setFile(null);
	};

	return (
		<div className="flex flex-col items-center gap-4">
			{!preview && (
				<>
					<Webcam
						ref={webcamRef}
						audio={false}
						screenshotFormat="image/png"
						className="rounded shadow"
						videoConstraints={videoConstraints}
					/>
					<button
						className="px-4 py-2 rounded bg-blue-600 text-white"
						onClick={capture}
					>
						Take Photo
					</button>
					<span className="text-sm text-gray-500">or</span>
					<Input
						type="file"
						accept={accept}
						onChange={handleFile}
						className="block"
					/>
				</>
			)}

			{preview && file && (
				<>
					<img
						src={preview}
						alt="Selected"
						className="rounded shadow-md object-cover max-h-[50vh]"
					/>
					<div className="flex gap-4 w-full justify-center">
						<Button onClick={() => onSubmit?.(file)} type="submit">
							Save changes
						</Button>
						<Button onClick={reset} variant="secondary">
							Retake / Choose Again
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

export default UpdatePhoto;
