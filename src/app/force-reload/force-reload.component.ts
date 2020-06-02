import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-force-reload',
  templateUrl: './force-reload.component.html',
  styleUrls: []
})
export class ForceReloadComponent {
  forceReload: boolean;

  // this will be replaced by actual hash post-build.js
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(
    private http: HttpClient
  ) {
    let url: string;
    if (window.location.origin) {
      url = window.location.origin;
    } else if (window.location.hostname && window.location.protocol) {
      url = window.location.origin;
    }

    if (url) {
      url += '/version.json';
      this.initVersionCheck(url, 90000);
    }
  }

  /**
   * Checks in every set frequency the version of frontend application
   * @param frequency - in milliseconds, defaults to 30 minutes
   */
  private initVersionCheck(url: string, frequency = 1000 * 60 * 30) {
    this.checkVersion(url);
    setInterval(() => {
      this.checkVersion(url);
    }, frequency);
  }

  /**
   * Will do the call and check if the hash has changed or not
   */
  private checkVersion(url: string) {
    // timestamp these requests to invalidate caches
    this.http.get(url + '?t=' + new Date().getTime())
      .subscribe(
        (response: any) => {
          const hash = response.hash;
          const hashChanged = this.hasHashChanged(this.currentHash, hash);

          // If new version, do something
          if (hashChanged) {
            // CODE TO DO SOMETHING UPON VERSION CHANGE
            this.forceReload = true;
          }
        },
        (err) => {
          console.error(err, 'Could not get version');
        }
      );
  }

  /**
   * Checks if hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   */
  private hasHashChanged(currentHash: string, newHash: string): boolean {
    return currentHash && (currentHash !== newHash);
  }
}
