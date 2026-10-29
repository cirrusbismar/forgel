import { execSync, type ExecSyncOptionsWithStringEncoding } from 'child_process';

export const readBuffer = <T,>(
  command: string,
  options?: Omit<ExecSyncOptionsWithStringEncoding, 'encoding'> & { reducer?: (buffer: string) => T  }
) => {
  try {
    const a = (a: string) => a as unknown as T;
    const bufferReducer = options?.reducer ?? a;
    delete options?.reducer;

    const buffer = execSync(command, {
      encoding: 'utf8',
      ...options,
    });

    // Split the output into individual lines and clean them up
    const branches = bufferReducer(buffer);

    return branches;
  } catch (error) {
    console.error('Error fetching Git branches');
    return [];
  }
}
