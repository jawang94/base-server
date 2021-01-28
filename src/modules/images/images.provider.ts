import { Request, Response } from 'express';
import Jimp from 'jimp';

import { ModuleSessionInfo } from '@graphql-modules/core';
import { Inject, Injectable, ProviderScope } from '@graphql-modules/di';

// import { gcd } from '../../utils/gcd';
// import fs from 'fs';
// import http from 'http';

@Injectable({
  scope: ProviderScope.Session,
})
export class Images {
  @Inject() private module: ModuleSessionInfo;

  private get req(): Request {
    return this.module.session.req || this.module.session.request;
  }

  private get res(): Response {
    return this.module.session.res;
  }

  async resizeImage({
    url,
    height,
    width,
    format,
  }: {
    url: string;
    height?: number;
    width: number;
    format?: string;
  }): Promise<Record<string, Promise<any>>> {
    const resizedImage = Jimp.read(url)
      .then(async (image) => {
        const resizedImage = image.resize(width, height ? height : Jimp.AUTO);

        const base64 = await resizedImage.getBase64Async(resizedImage._originalMime);
        return { ...resizedImage, base64 };
        // Do stuff with the image.
      })
      .catch((err) => {
        return { error: err };
        // Handle an exception.
      });
    return { image: resizedImage };
  }
}

// if (format && format === 'square') {
//   let setHeight = height;
//   if (!setHeight) {
//     const w = image.bitmap.width;
//     const h = image.bitmap.height;
//     const divisor = gcd(image.bitmap.width, image.bitmap.height);
//     const heightMultiplier = w / divisor / (h / divisor);
//     setHeight = image.bitmap.height * heightMultiplier;
//     console.log(divisor, heightMultiplier, setHeight);
//   }
//   console.log(
//     'formatted',
//     image.cover(resizedImage.bitmap.width, resizedImage.bitmap.height),
//   );
// }

// const w = image.bitmap.width;
// const h = image.bitmap.height;
// const r = gcd(w, h);
// console.log('Dimensions = ' + w + ' x ' + h);
// console.log('Aspect ratio = ' + w / r + ':' + h / r);
// console.log('multiply by', w / r / (h / r));
// const scaleHeightBy = w / r / (h / r);
