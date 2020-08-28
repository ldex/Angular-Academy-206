import { Component } from '@angular/core';

@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent {
    constructor() { 
        // console.log('Before sleep');
        // this.sleep(2000);
        // console.log('After sleep');

        if (typeof Worker !== 'undefined') {
            console.time('Web worker');
            const worker = new Worker('./home.worker', { type: 'module' });
            
            worker.onmessage = ({ data }) => {
              console.log(`page got message: ${data}`);
              console.timeEnd('Web worker');
            };
            worker.postMessage('hello');
          } else {
            // Web Workers are not supported in this environment.
            // You should add a fallback so that your program still executes correctly.
          }

    }



}
