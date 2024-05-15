import { html } from "html/mod.ts"

export const uploaderTemplate = html`
	<body>
		<pre>
         *                  *
             __                *
          ,db'    *     *
         ,d8/       *        *    *
         888
         \`db\       *     *
           \`o\`_                    **
      *               *   *    _      *
            *                 / )
         *    (\__/) *       ( (  *
       ,-.,-.,)    (.,-.,-.,-.) ).,-.,-.
      | @|  ={      }= | @|  / / | @|o |
     _j__j__j_)     \`-------/ /__j__j__j_
     ________(               /___________
      |  | @| \\              || o|O | @|
      |o |  |,'\\       ,   ,'"|  |  |  |  hjw
     vV\\|\/vV|\`-'\\  ,---\\   | \\Vv\\hjwVv\\//v
                _) )    \`. \ /
               (__/       ) )
                         (_/

                  tempstore
		</pre>
		<br/>
		<div>
		<form method="post" enctype="multipart/form-data">
			<label for="file">Choose a file to upload</label>
			<input type="file" id="file" name="file">
			<br/>

			<button>Upload</button>
		</form>
		</div>
	</body>
`