import { html } from "html/mod.ts"

export const uploaderTemplate = html`
	<body>
		<form method="post" enctype="multipart/form-data">
			<label for="file">Choose a file to upload</label>
			<input type="file" id="file" name="file">

			<button>Upload</button>
		</form>
	</body>
`