// Template component

import { Component } from "@angular/core";

// Use block-ui-template class to center div if desired
@Component({
  template: `
    <div class="block-ui-template">
    <div class="block-ui-loader"></div>
      <p> {{ message }}</p>
    </div>
  `,
  styleUrls: ["./block-ui-template.scss"],
})
export class BlockTemplateCmp {
  message: string;
}
