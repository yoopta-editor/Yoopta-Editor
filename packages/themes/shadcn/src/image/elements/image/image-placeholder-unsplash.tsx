import { Button } from '../../../ui/button';
import { TabsContent } from '../../../ui/tabs';

export const ImagePlaceholderUnsplash = ({ onInsertFromUnsplash }) => (
  <TabsContent value="unsplash" className="mt-4">
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="rounded-lg bg-muted p-3">
        <svg className="h-6 w-6" viewBox="0 0 32 32" fill="currentColor">
          <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Browse free photos</p>
        <p className="text-xs text-muted-foreground">Powered by Unsplash</p>
      </div>
      <Button onClick={onInsertFromUnsplash}>Browse photos</Button>
    </div>
  </TabsContent>
);
