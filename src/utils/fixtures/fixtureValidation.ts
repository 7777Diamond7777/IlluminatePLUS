import { Fixture } from '../../types/fixtures';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateFixture(fixture: Fixture): ValidationError[] {
  const errors: ValidationError[] = [];

  // Basic validation
  if (!fixture.name) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (fixture.universe < 1 || fixture.universe > 64) {
    errors.push({ field: 'universe', message: 'Universe must be between 1 and 64' });
  }

  if (fixture.address < 1 || fixture.address > 512) {
    errors.push({ field: 'address', message: 'Address must be between 1 and 512' });
  }

  // Check for address overlap
  const lastAddress = fixture.address + fixture.channels.length - 1;
  if (lastAddress > 512) {
    errors.push({
      field: 'address',
      message: `Fixture channels exceed universe boundary (${lastAddress} > 512)`
    });
  }

  // Validate channels
  fixture.channels.forEach((channel, index) => {
    if (!channel.name) {
      errors.push({
        field: `channels[${index}].name`,
        message: `Channel ${index + 1} name is required`
      });
    }

    if (channel.range) {
      if (channel.defaultValue !== undefined &&
          (channel.defaultValue < channel.range.min ||
           channel.defaultValue > channel.range.max)) {
        errors.push({
          field: `channels[${index}].defaultValue`,
          message: `Channel ${index + 1} value out of range`
        });
      }
    }
  });

  return errors;
}