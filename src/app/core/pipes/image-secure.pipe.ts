import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'imageSecure'
})
export class ImageSecurePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}
  transform(imageUrl: String): SafeUrl {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Aucun token JWT trouvé');
      return 'assets/images/forbiden.png';
    }
 
    const secureUrl = `${imageUrl}?token=${token}`;
    return this.sanitizer.bypassSecurityTrustUrl(secureUrl);
  }
 
}

