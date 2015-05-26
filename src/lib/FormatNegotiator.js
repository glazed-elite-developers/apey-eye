/**
 * Created by Filipe on 17/03/2015.
 */
import * as Formatters from './Formatters';
import * as DefaultProperties from './DefaultProperties';
import Negotiator from 'negotiator';

class FormatNegotiator {
    static selectFormatter(requestProperties) {
        let formatters = Formatters.FormattersList,
            mediaTypeFormatters = {};

        if (formatters && formatters.length > 0) {
            formatters.forEach(formatter => {
                let mediaType = formatter.getMediaType();
                mediaTypeFormatters[mediaType] = formatter;
            });

            let negotiator = new Negotiator({
                headers: {
                    accept: requestProperties._format || requestProperties._mediaType
                }
            });

            let mediaTypeAccepted = negotiator.mediaType(Object.keys(mediaTypeFormatters));
            let formatterAccepted = mediaTypeFormatters[mediaTypeAccepted];

            if (mediaTypeAccepted && formatterAccepted && (formatterAccepted.prototype instanceof Formatters.BaseFormatter)) {
                return formatterAccepted;
            }
            else {
                return DefaultProperties.Formatter;
            }
        }
        else {
            return DefaultProperties.Formatter;
            return DefaultProperties.Formatter;
        }

    }
}
export default FormatNegotiator;