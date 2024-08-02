import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { IUploadedMulterFile } from 'src/providers/files/s3/interfaces/upload-file.interface';

@Injectable()
export class UploadFileValidationPipe implements PipeTransform {
    transform(value: IUploadedMulterFile, metadata: ArgumentMetadata) {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        const maxFileSize = 10 * 1024 * 1024;

        if (!allowedMimeTypes.includes(value.mimetype!)) {
            throw new BadRequestException(
                'Invalid file type. Only JPEG and PNG files are allowed.',
            );
        }

        if (value.size! > maxFileSize) {
            throw new BadRequestException(
                'File size exceeds the limit of 10MB.',
            );
        }

        return value;
    }
}
